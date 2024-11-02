import React from 'react';
import { auth } from '../../hooks';
import { View, Text, Card } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, FlatList, Pressable } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { getNextNotebooks, getNotebooks, searchNote } from './helper';
import { Back, EmptyState, Icon, Loader, NoteList, Input } from '../../components';

const limit = 10;
const { width } = Dimensions.get('window');

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function CreateNote() {

    const navigation = useNavigation();

    const [notes, setNotes] = React.useState(['_']);
    const [searchNotes, setSearchNotes] = React.useState([]);

    const [search, setSearch] = React.useState({
        text: '',
        loading: false,
    });

    const filteredItems = React.useMemo(() => {
        const filteredChats = notes.filter(note => {
            const noteNameMatchesSearch = note?.title?.toLowerCase()?.includes(search.text.trim().toLowerCase());
            const noteNameNotInUsers = !searchNotes?.some(snote => snote?.title?.trim()?.toLowerCase() === note?.title?.trim()?.toLowerCase());
            return noteNameMatchesSearch && noteNameNotInUsers;
        });
        return filteredChats;
    }, [notes, search.text, searchNotes]);

    const handleChange = React.useCallback((val) => {
        setSearch(state => ({
            ...state,
            ...val,
        }));
    }, [setSearch]);

    const onEndReached = () => {
        if(notes.length>=limit){
            getNextNotebooks(setNotes, lastVisible, setLastVisible, limit);
        }
    };

    const nav = (item) => navigation.navigate('CreateNote', {...item});

    React.useEffect(() => {
        const term = search.text.trim().toLowerCase();
        if(term.length===0){
            handleChange({ loading: false });
        }else{
            handleChange({ loading: true });
            const delayDebounceFn = setTimeout(() => {
                searchNote(term, setSearchNotes, handleChange, 5);
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [search.text]);

    React.useEffect(() => {
        getNotebooks(setNotes, setLastVisible, limit);
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text60 textC1>Notes</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const body2 = React.useMemo(() => (
        <View>
            {searchNotes?.map(item => (
                <NoteList
                onPress={() => nav(item)} 
                {...item}/>
            ))}
        </View>
    ));

    const searchbar = React.useMemo(() => (
        <View width={width}>
            <View width={width} height={60} center marginT-6>
                <Input 
                w={width*0.94} 
                val={search.text}
                loading={search.loading}
                placeholder='Search your notes...'
                onChange={e => handleChange({ text: e })}/>
            </View>
            {body2}
        </View>
    ));

    const renderItem = React.useCallback(({item}) => (
        <NoteList
        onPress={() => nav(item)} 
        {...item}/>
    ));

    const empty = React.useMemo(() => (
        <EmptyState
        title='No notes'
        subtitle='Create a note now'
        icon='notebook'
        type='material-community'/>
    ));

    const createbt = React.useMemo(() => (
        <View absB absR>
            <Pressable 
            onPress={() => nav({ 
                id: null, 
                title: '', 
                timestamp: Date.now(), 
                data: JSON.stringify(""), 
                editorsData: [{ name: auth.currentUser.displayName, uid: auth.currentUser.uid }] 
            })}>
                <Card width={58} height={58} borderRadius={30} marginR-26 marginB-32>
                    <View width={58} height={58} borderRadius={30} center bg-primary>
                        <Icon name='edit-2' type='feather' size={28}/>
                    </View>
                </Card>
            </Pressable>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlatList
        numColumns={2}
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReachedThreshold={0.8}
        onEndReached={onEndReached}
        ListHeaderComponent={searchbar}
        showsVerticalScrollIndicator={false}/>
    ));

    if(notes[0]==='_') return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            {notes.length===0?empty:body}
            {createbt}
        </View>

    );

};