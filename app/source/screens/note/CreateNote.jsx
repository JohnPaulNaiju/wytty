import React from 'react';
import Toolbar from './Toolbar';
import { auth } from '../../hooks';
import Toast from 'react-native-toast-message';
import { saveNote, deleteNote } from './helper';
import { getDp, timeAgo } from '../../functions';
import { RichEditor } from "react-native-pell-rich-editor";
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Platform, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import { Icon, Menu, Loader, AvatarGroup, ActionSheet, ListItemWithAvatar } from '../../components';

const isAndroid = Platform.OS==='android';

export default function CreateNote() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id, title, timestamp, data, editorsData } = route.params;

    const parsed_Data = JSON.parse(data) || data;

    const scrollRef = React.useRef(null);
    const delRef = React.useRef(0);
    const changes = React.useRef(0);
    const editor = React.useRef(null);
    const value = React.useRef('');

    const [Title, setTitle] = React.useState(title);
    const [editors, setEditors] = React.useState([]);

    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const markChanges = () => changes.current++;

    const handleTitleChange = React.useCallback((e) => {
        setTitle(e);
        markChanges();
    }, [setTitle]);

    const handleChange = React.useCallback((e) => {
        value.current = e;
        markChanges();
    }, [value.current]);

    const handleOpen = React.useCallback(() => {
        setOpen(state => !state);
    }, [setOpen]);

    const save = async(title) => {
        setLoading(true);
        changes.current=0;
        const data = JSON.stringify(value.current);
        await saveNote(id, data, title).then(() => {
            Toast.show({ text1: 'Saved 🎉' });
        }).catch(() => {
            Toast.show({ text1: 'Error saving' });
        });
        setLoading(false);
    };

    const del = (uid) => {
        if(uid===auth.currentUser.uid){
            if(delRef.current===0){
                delRef.current++;
                Toast.show({ text1: 'Press delete once more' });
                setTimeout(() => {
                    delRef.current = 0;
                }, 5000);
                return;
            }
            navigation.goBack();
            deleteNote(id).then(() => {
                Toast.show({ text1: 'Deleted' });
            }).catch(() => {
                Toast.show({ text1: 'Error deleting' });
            });
            return
        }
        Toast.show({ text1: 'Only author can delete this note' });
    };

    const editorFetch = async() => {
        setEditors(await Promise.all(editorsData?.map(async(obj) => ({
            uid: obj.uid,
            name: obj.name,
            dp: obj.uid===auth.currentUser.uid?auth.currentUser.photoURL:await getDp(obj.uid),
        }))));
    };

    const navToProfile = (by, name) => {
        if(by===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', { id: by, username: name });
    };

    const addImage = async(e) => {
        editor.current?.insertImage(e);
        console.log(e);
    };

    React.useEffect(() => {
        editorFetch();
    }, []);

    React.useEffect(() => {
        const unsub = navigation.addListener('beforeRemove', e => {
            if(changes.current!==0){
                e.preventDefault();
                save(Title);
                setTimeout(() => {
                    navigation.goBack();
                }, 500);
            }
        });
        return () => unsub();
    }, [navigation, Title]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View marginL-16 paddingL-8 bg-bg2 br100 center width={50} height={50} style={{ borderStyle: 'dashed', borderColor: Colors.textC2, borderWidth: 1 }}>
                        <Icon name='arrow-back-ios'/>
                    </View>
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <TouchableOpacity onPress={handleOpen}>
                    <View row centerV br60 bg-primary paddingH-6 height={32}>
                        <AvatarGroup 
                        size={20} 
                        limit={3} 
                        url={editors?.map(e => e.dp)}
                        num={editors?.length>3?editors?.length-3:editors?.length-1}/>
                        <Text textC1 text90BO marginL-6>editors</Text>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View>
                    {loading?
                    <View padding-6 marginR-12 height={40} center>
                        <Loader size={30}/>
                    </View>
                    :
                    <Menu
                    style={{ marginRight: 16 }}
                    children={
                        <View bg-bg2 br100 center width={50} height={50} style={{ borderStyle: 'dashed', borderColor: Colors.textC2, borderWidth: 1 }}>
                            <Icon name='grid-outline' type='ion'/>
                        </View>
                    }
                    options={[
                        {
                            text: 'Preview',
                            icon: 'eye',
                            type: 'entypo',
                            color: Colors.textC1,
                            onPress: () => navigation.navigate('NoteView', { id: id }),
                        },
                        {
                            text: 'Save',
                            icon: 'save',
                            type: 'feather',
                            color: Colors.textC1,
                            onPress: () => save(Title),
                        },
                        {
                            text: 'Delete',
                            icon: 'trash',
                            type: 'feather',
                            color: Colors.red,
                            onPress: () => del(editors[0]?.uid),
                        }
                    ]}/>}
                </View>
            ),
        });
    }, [navigation, loading, editors, Title]);

    const children = React.useMemo(() => (
        <View width='100%'>
            {editors?.map((obj, i) => (
            <ListItemWithAvatar 
            key={i} 
            title={obj.name} 
            url={obj.dp} 
            subtitle={`Editor`}
            onPress={() => navToProfile(obj.uid, obj.name)}
            right={i===0?
            <View paddingV-2 paddingH-4 br20 bg-primary>
                <Text text90 style={{ fontWeight: 'bold' }}>Author</Text>
            </View>:null}/>
            ))}
        </View>
    ));

    const action = React.useMemo(() => (
        <ActionSheet
        open={open}
        close={handleOpen}
        children={children}/>
    ));

    const header = React.useMemo(() => (
        <View marginT-36 marginL-16 marginR-56>
            <TextInput 
            multiline 
            maxLength={60} 
            placeholder='Title' 
            style={{ fontSize: 26 }} 
            placeholderTextColor={Colors.textC2} 
            onChangeText={e => handleTitleChange(e)}>
                <Text text40M textC1>{Title}</Text>
            </TextInput>
            <Text text70R textC2 marginT-6 marginL-2>{timeAgo(timestamp)} • by {`${editors[0]?.name} ${editors.length>1?`and ${editors.length-1} others`:''}`}</Text>
        </View>
    ));

    const section = React.useMemo(() => (
        <RichEditor
        ref={editor}
        initialFocus
        scalesPageToFit
        scrollEnabled={true}
        onChange={e => handleChange(e)}
        initialContentHTML={parsed_Data}
        showsVerticalScrollIndicator={false}
        placeholder='Tap here to continue...'
        editorInitializedCallback={() => setLoading(false)}
        onCursorPosition={e => scrollRef.current?.scrollTo({ y: e-30, animated: true })}
        editorStyle={{ backgroundColor: Colors.bg1, color: Colors.textC1, placeholderColor: Colors.textC2, caretColor: Colors.primary }}/>
    ));

    const footer = React.useMemo(() => (
        <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={105}>
            <Toolbar editor={editor} addImage={addImage}/>
        </KeyboardAvoidingView>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            <ScrollView ref={scrollRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={100} style={{ flex: 1 }}>
                    {header}
                    {section}
                </KeyboardAvoidingView>
            </ScrollView>
            {footer}
            {open?action:null}
        </View>

    );

};