import React from 'react';
import Toast from 'react-native-toast-message';
import { stringToColor } from '../../../functions';
import { Dimensions, FlatList } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Back, FileList, Icon, Input } from '../../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SaveMessage as SaveChatMsg } from '../../connection/helper';
import { SaveMessage, createCategory, getCategories, getMyFiles } from './helper';
import { View, Text, Colors, TouchableOpacity, Chip, TextField, } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const unsubscribe = [];

export default function SendNote() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, reply, text, from } = route.params;

    const catRef = React.useRef('');
    const inpRef = React.useRef(null);

    const [selected, setSelected] = React.useState({
        ix: null,
        name: null,
        size: null,
        url: null,
        mime: null,
        cat: null,
        msg: text,
    });
    const [files, setFiles] = React.useState(['_']);
    const [term, setTerm] = React.useState('');
    const [category, setCategory] = React.useState([]);

    const filteredItems = React.useMemo(() => files.filter(item => {
        return item?.name?.toLowerCase().includes(term.toLowerCase());
    }));

    const handleSelect = React.useCallback((val) => {
        setSelected(prev => ({
            ...prev,
            ...val,
        }));
    }, [setSelected]);

    const share = () => {
        if(from==='tribe'){
            SaveMessage(roomId, null, 'file', null, reply, selected).then(() => {
                Toast.show({ text1: "Your file was send 🎉" });
            }).catch(() => {
                Toast.show({ text1: "Couldn't process your request" });
            });
        }else if(from==='chat'){
            SaveChatMsg(roomId, null, 'file', null, reply, selected).then(() => {
                Toast.show({ text1: "Your file was send 🎉" });
            }).catch(() => {
                Toast.show({ text1: "Couldn't process your request" });
            });
        }
        navigation.goBack();
    };

    React.useEffect(() => {
        if(from==='tribe') getCategories(roomId, setCategory, unsubscribe);
        getMyFiles(setFiles);
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
            headerTitle: () => <Text text60 textC1>Select a file</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                from==='tribe'?
                <View>
                    { (selected.ix!==null&&selected.cat!==null)?
                    <TouchableOpacity marginR-16 padding-6 onPress={share}>
                        <Icon name='ios-send' type='ion'/>
                    </TouchableOpacity> : null }
                </View>:
                <View>
                    { (selected.ix!==null)?
                    <TouchableOpacity marginR-16 padding-6 onPress={share}>
                        <Icon name='ios-send' type='ion'/>
                    </TouchableOpacity> : null }
                </View>
            ),
        });
    }, [navigation, selected.ix, selected.cat]);

    const catHead = React.useMemo(() => (
        <View row centerV br60 padding-6 bg-bg2>
            <TextField
            marginL-6
            ref={inpRef}
            maxLength={30}
            placeholder='New category'
            placeholderTextColor={Colors.textC2}
            onChangeText={e => catRef.current=e}/>
            {category.length>49?null:
            <TouchableOpacity marginL-10 onPress={() => {
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
            <View width={width} centerH bg-bg1 paddingV-8>
                <Input w={width*0.95} s
                val={term} onChange={e => setTerm(e)}
                placeholder='Search your files...'/>
            </View>
            {from==='tribe'?
            <View marginT-16 centerV paddingH-16 width={width}>
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

    const renderItem = React.useCallback(({item, index}) => (
        <FileList 
        marginT-6
        share
        selected={selected.ix===index}
        open={() => {
            if(from==='tribe'){
                Toast.show({ text1: 'Also select or create a category ↑' });
            }
            handleSelect({ ix: index, name: item.name, size: item.size, url: item.url, mime: item.mime })
        }} 
        {...item}/>
    ));

    const empty = React.useMemo(() => (
        <View width={width} center>
            <Text centerH text70R textC2 marginT-56>{files[0]==='_'?'Loading files':'No files'}</Text>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            {header}
            <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            ListEmptyComponent={empty}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};