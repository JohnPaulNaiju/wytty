import React from 'react';
import Toast from 'react-native-toast-message';
import { auth, limits, useData } from '../../hooks';
import { Request, UnRequest } from '../profile/helper';
import { View, Text, Colors } from 'react-native-ui-lib';
import { ActivityIndicator, FlatList } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { Loader, TribeBox, EmptyState, UserSuggest } from '../../components';
import { recommendNextTribes, recommendTribes, recommendAllTribes, recommendNextAllTribes, recommendUser } from './recommend';

const limit = 6;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const { cLimit } = limits;

const Section = ({category}) => {

    const { profile } = useData();
    const navigation = useNavigation();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [tribes, setTribes] = React.useState(['_']);
    const [users, setUsers] = React.useState(['_']);

    const onEndReached = () => {
        if(tribes.length>=limit){
            if(category==='All'){
                recommendNextAllTribes(setTribes, lastVisible, setLastVisible, limit, profile?.tribeId);
                return;
            }
            recommendNextTribes(category, setTribes, lastVisible, setLastVisible, limit, profile?.tribeId);
        }
    };

    const navToProfile = (id, name) => {
        if(id===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', { id: id, username: name });
    };

    const connectWithUser = (id, username, token, state) => {
        try{
            if(profile?.connection>=cLimit){
                Toast.show({ text1: `You can have only ${cLimit} connections` });
                return;
            }
            if(state) UnRequest(id);
            else Request(id, username, token);
        }catch{
            navToProfile(id, username);
        }
    };

    React.useEffect(() => {
        if(category==='All'){
            recommendAllTribes(setTribes, setLastVisible, limit, profile?.tribeId);
            return;
        }
        recommendUser(profile?.connectionId, category, setUsers, 5);
        recommendTribes(category, setTribes, setLastVisible, limit, profile?.tribeId);
    }, []);

    const empty = React.useMemo(() => (
        <EmptyState 
        type='feather'
        icon='triangle'
        title='No tribes'
        btTitle='Create New Tribe'
        onPress={() => navigation.navigate('CreateTribe', { index: 0, tribeId: null })}/>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <TribeBox 
        index={index} 
        route='TribeInfo' 
        {...item}/>
    ));

    const renderUsers = React.useCallback(({item}) => (
        <UserSuggest 
        onPress={() => navToProfile(item.id, item.username)} 
        onBtPress={connectWithUser} 
        {...item}/>
    ));

    const usersview = React.useMemo(() => (
        <View width='100%'>
            {users.length===0?null:users[0]==='_'?
            <View center width='100%' height={50}>
                <ActivityIndicator size='small' color={Colors.textC2}/>
            </View>:
            <View width='100%'>
                <Text textC1 text70 marginH-16 marginT-12 numberOfLines={1} style={{ fontWeight: 'bold' }}>Who to connect</Text>
                <FlatList
                horizontal
                renderItem={renderUsers}
                keyExtractor={(i,x) => x}
                data={users.filter(Boolean)}
                showsHorizontalScrollIndicator={false}/>
            </View>}
            <Text textC1 text70 marginH-16 marginT-12 style={{ fontWeight: 'bold' }}>Tribes to join</Text>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlatList
        ref={scrollRef}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
        data={tribes.filter(Boolean)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={category==='All'?null:usersview}/>
    ));

    if(tribes[0]==='_') return <Loader/>;

    return (

        <View flex>
            {(tribes.filter(Boolean).length===0&&users.filter(Boolean))?empty:body}
        </View>

    );

};

export default React.memo(Section);