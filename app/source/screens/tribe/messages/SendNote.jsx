import React from 'react';
import Toast from 'react-native-toast-message';
import { stringToColor } from '../../../functions';
import { Dimensions, FlatList } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Back, Icon, Input, NoteList } from '../../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SaveMessage as SaveChatMsg } from '../../connection/helper';
import { View, Text, Colors, TouchableOpacity, Chip, TextField, } from 'react-native-ui-lib';
import { SaveMessage, createCategory, getCategories, getNextNote, searchNote } from './helper';

const { width } = Dimensions.get('window');
const limit = 10;
const unsubscribe = [];

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function SendNote() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, reply, text, from } = route.params;

    const catRef = React.useRef('');
    const inpRef = React.useRef(null);

    const [category, setCategory] = React.useState([]);
    const [notes, setNotes] = React.useState([]);
    const [term, setTerm] = React.useState('');

    const [selected, setSelected] = React.useState({
        id: null,
        title: null,
        cat: null,
        msg: text,
    });

    const [state, setState] = React.useState({
        loading: false,
        noresult: false,
    });

    const handleChange = React.useCallback((val) => {
        setState(prev => ({
            ...prev,
            ...val
        }));
    }, [setState]);

    const handleSelect = React.useCallback((val) => {
        setSelected(prev => ({
            ...prev,
            ...val,
        }));
    }, [setSelected]);

    const onEndReached = () => {
        if(notes.length>=limit){
            const searchTerm = term.toLowerCase();
            getNextNote(searchTerm, setNotes, lastVisible, setLastVisible, limit);
        }
    };

    const send = () => {
        if(from==='tribe'){
            SaveMessage(roomId, null, 'note', null, reply, selected).then(() => {
                Toast.show({ text1: "Your note was send 🎉" });
            }).catch(() => {
                Toast.show({ text1: "Couldn't process your request" });
            });
        }else if(from==='chat'){
            SaveChatMsg(roomId, null, 'note', null, reply, selected).then(() => {
                Toast.show({ text1: "Your file was send 🎉" });
            }).catch(() => {
                Toast.show({ text1: "Couldn't process your request" });
            });
        }
        navigation.goBack();
    };

    const onSubmit = async(term) => {
        if(term?.length===0) return;
        handleChange({ loading: true, noresult: false });
        const searchTerm = term.toLowerCase();
        await searchNote(searchTerm, setNotes, setLastVisible, limit, handleChange);
    };

    React.useEffect(() => {
        if(from==='tribe') getCategories(roomId, setCategory, unsubscribe);
        return () => {
            if(from==='tribe'){
                for(let i = 0; i < unsubscribe.length; i++){
                    unsubscribe[i]();
                }
            }
        }
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text60 textC1>Select note</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                from==='tribe'?
                <View>
                    { (selected.id!==null&&selected.cat!==null)?
                    <TouchableOpacity marginR-16 padding-6 onPress={send}>
                        <Icon name='ios-send' type='ion'/>
                    </TouchableOpacity> : null }
                </View>:
                <View>
                    { (selected.id!==null)?
                    <TouchableOpacity marginR-16 padding-6 onPress={send}>
                        <Icon name='ios-send' type='ion'/>
                    </TouchableOpacity> : null }
                </View>
            ),
        });
    }, [navigation, selected.id, selected.cat]);

    const catHead = React.useMemo(() => (
        <View row centerV br60 padding-6 bg-bg2>
            <TextField 
            marginL-6
            maxLength={30}
            ref={inpRef} 
            placeholder='New category' 
            placeholderTextColor={Colors.textC2} 
            onChangeText={e => catRef.current=e}/>
            { category.length>49?null:
            <TouchableOpacity marginL-16 onPress={() => {
                if(catRef.current?.trim().length===0) return;
                createCategory(roomId, catRef.current);
                setTimeout(() => {
                    inpRef.current?.clear();
                }, 100);
            }}>
                <Chip label='Add'
                labelStyle={{ color: Colors.textC1 }}
                containerStyle={{ backgroundColor: Colors.primary, borderWidth: 0 }}/>
            </TouchableOpacity>}
        </View>
    ));

    const renderChip = React.useCallback(({item}) => (
        <View marginV-6>
            <TouchableOpacity onPress={() => handleSelect({ cat: item })}>
                <View height={30} centerV marginR-8>
                    <Chip label={item}
                    backgroundColor={selected.cat===item?stringToColor(item||''):null}
                    labelStyle={{ color: selected.cat===item?Colors.textC1:stringToColor(item||'') }}
                    containerStyle={{ borderColor: selected.cat===item?null:stringToColor(item||'') }}/>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const header = React.useMemo(() => (
        <View width={width} paddingB-6>
            <View width={width} centerH paddingV-8>
                <Input s w={width*0.95} loading={state.loading}
                val={term} onChange={e => setTerm(e)} submit={() => onSubmit(term.trim())}
                type='search' placeholder='Search your notes...'/>
            </View>
            {from==='tribe'?
            <View marginV-6 centerV paddingH-16 width={width}>
                <FlatList
                horizontal
                data={category}
                renderItem={renderChip}
                keyExtractor={(i,x) => x}
                ListFooterComponent={catHead}
                showsHorizontalScrollIndicator={false}/>
            </View>:null}
        </View>
    ));

    const renderItem = React.useCallback(({item}) => (
        <NoteList
        selected={selected.id===item.id?Colors.primary+'0f':null}
        onPress={() => {
            if(from==='tribe'){
                Toast.show({ text1: 'Also select or create a category ↑' });
            }
            handleSelect({ id: item.id, title: item.title })
        }}
        {...item}/>
    ));

    const empty = React.useMemo(() => (
        <View width={width} centerH marginT-36>
            <Text centerH text70R textC2>No results</Text>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            
            {header}
            <FlatList
            data={notes}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.8}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={state.noresult?empty:null}/>
        </View>

    );

};