import React from 'react';
import { FlatList } from 'react-native';
import { View } from 'react-native-ui-lib';
import { fetchChats, fetchNextChats } from './helper';
import { useScrollToTop } from '@react-navigation/native';
import { ChatBox, EmptyState, Skeleton } from '../../components';

const limit = 15;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const Messaging = ({users, searchTerm}) => {

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [chats, setChats] = React.useState(['_']);

    const filteredItems = React.useMemo(() => {
        const filteredChats = chats.filter(chat => {
            const chatNameMatchesSearch = chat?.name?.includes(searchTerm);
            const chatNameNotInUsers = !users?.some(user => user?.name === chat?.name);
            return chatNameMatchesSearch && chatNameNotInUsers;
        });
        return filteredChats;
    }, [chats, searchTerm, users]);

    const onEndReached = () => {
        if(chats.length>=limit){
            fetchNextChats(setChats, lastVisible, setLastVisible, limit);
        }
    }

    React.useEffect(() => {
        fetchChats(setChats, setLastVisible, limit);
    }, []);

    const body2 = React.useMemo(() => (
        <View>
            {users?.map(item => <ChatBox search {...item}/>)}
        </View>
    ));

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='users' 
        type='font-awesome' 
        title='No connections' 
        subtitle="You don't have any connections to show"/>
    ));

    const renderItem = React.useCallback(({item}) => <ChatBox {...item}/>);

    const body = React.useMemo(() => (
        <FlatList
        ref={scrollRef}
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        ListHeaderComponent={body2}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        showsVerticalScrollIndicator={false}/>
    ));

    if(chats[0]==='_') return <Skeleton type='chat'/>;

    return (

        <View flex>
            {chats.length===0?empty:body}
        </View>

    );

};

export default React.memo(Messaging);