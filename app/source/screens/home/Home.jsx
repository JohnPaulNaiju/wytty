import React from 'react';
import Header from './Header';
import PostView from './PostView';
import { logoimg } from '../../assets';
import { FlatList } from 'react-native';
import { claimWoint } from '../../functions';
import { useData, useNotify } from '../../hooks';
import { fetchNextTribes, fetchTribes } from './helper';
import { Icon, TribeList, Skeleton } from '../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Image, TouchableOpacity } from 'react-native-ui-lib';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

const limit = 12;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Home() {

    const navigation = useNavigation();
    const { profile } = useData();
    const { handleNotify } = useNotify();

    const render = React.useRef(false);
    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [items, setItems] = React.useState(['_']);
    const [toggle, setToggle] = React.useState(false);

    const uniqueItems = React.useMemo(() => Array.from(new Set(items.map(item => item.roomId))).map(roomId => {
        return items.find(item => item.roomId === roomId);
    }));

    const onPress = (index, item) => {
        navigation.navigate('Tribe', {...item});
        setTimeout(() => {
            setItems(prev => {
                const tribes = [...prev];
                tribes[index] = { ...tribes[index], post: 0, msg: 0, admin: 0, poll: 0, file: 0, mention: 0 };
                return tribes;
            });
        }, 1000);
    };

    const onEndReached = () => {
        if(items.length>=limit){
            fetchNextTribes(setItems, lastVisible, setLastVisible, limit);
        }
    };

    const checkClaimEligibility = () => {
        const currentDate = new Date();
        if(profile?.lastClaimed){
            const is300Above = profile?.connection>300||false;
            const lastClaimedDate = profile?.lastClaimed?.toDate();
            const year = currentDate.getFullYear() === lastClaimedDate.getFullYear();
            const month = currentDate.getMonth() === lastClaimedDate.getMonth();
            const day = currentDate.getDate() === lastClaimedDate.getDate();
            const isSameDay = year&&month&&day;
            if(!isSameDay) claimWoint(is300Above?2:1);
        };
    };

    React.useEffect(() => {
        if(profile?.lastClaimed){
            if(!render.current){
                setTimeout(() => {
                    checkClaimEligibility();
                }, 1000);
                render.current = true;
            }
        }
    }, [profile?.lastClaimed]);

    React.useEffect(() => {
        if(items[0]!=='_'){
            if(items.length!==0){
                let unread = 0;
                items.forEach((item) => {
                    unread += item.msg||0 + item.admin||0 + item.post||0;
                });
                if(unread>0) handleNotify({ tribe: unread });
            }
        }
    }, [items]);

    React.useEffect(() => {
        fetchTribes(setItems, setLastVisible, limit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => toggle?null:<Image resizeMode='contain' source={logoimg} width={40} height={40}/>,
            headerLeft: () => toggle?<Header setTribes={setItems} close={() => setToggle(false)}/>:null,
            headerRight: () => headerRight,
        });
    }, [navigation, toggle]);

    const headerRight = React.useMemo(() => (
        <View row centerV marginR-16>
            <TouchableOpacity marginH-12 padding-6 onPress={() => navigation.navigate('CreateTribe', { index: 0, tribeId: null })}>
                <Icon name='plus-circle' type='feather'/>
            </TouchableOpacity>
            <TouchableOpacity padding-6 onPress={() => setToggle(state => !state)}>
                <Icon name='search' type='feather' size={26}/>
            </TouchableOpacity>
        </View>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <TribeList 
        dp={item.dp} 
        title={item.title} 
        roomId={item.roomId} 
        verified={item.verified} 
        onPress={() => onPress(index, item)} 
        msg={item.msg} post={item.post} mention={item.mention} 
        onLongPress={() => navigation.navigate('TribeDetails', {...item})}/>
    ));

    const skeletons = React.useMemo(() => <Skeleton type='tribe'/>);

    const mainview = React.useMemo(() => (
        <FlatList
        horizontal
        ref={scrollRef}
        data={uniqueItems}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        showsHorizontalScrollIndicator={false}/>
    ));

    const header = React.useMemo(() => (
        <View width='100%'>
            {items[0]==='_'?skeletons:mainview}
        </View>
    ));

    return (

        <View flex bg-bg1 useSafeArea>
            <PostView header={header}/>
        </View>

    );

};