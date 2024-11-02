import React from 'react';
import { auth, useData } from '../../hooks';
import { RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { View, Colors } from 'react-native-ui-lib';
import { PostBox, Skeleton } from '../../components';
import { recommendPosts, recommendNextPosts } from './helper';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

const limit = 15;

let lastVisible = null;
let indicatorVisible = true;

const setLastVisible = (val) => {
    lastVisible = val;
};

const toggleIndicator = (val) => {
    indicatorVisible = val;
};

const BottomIndicator = () => {

    if(!indicatorVisible) return null;

   const { Loader }= require('../../components');

    return (

        <View center width='100%' height={50}>
            <Loader size/>
        </View>

    );

};

const Empty = () => {

    const PostEmpty = require('./PostEmpty').default;
    return <PostEmpty/>;

};

const PostView = ({header}) => {

    let render = false;

    const navigation = useNavigation();
    const { profile } = useData();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const LikeArr = React.useRef({});

    const [array1, setArray1] = React.useState(['_']);
    const [toggle, setToggle] = React.useState(true);

    const tribeIds = React.useMemo(() => profile?.tribeId);

    const addToLikeArr = (id, liked, likes, comments) => {
        LikeArr.current[id] = {
            liked: liked,
            likes: likes,
            comments: comments,
        };
    };

    const incLike = (bool, id) => {
        if(bool){ 
            LikeArr.current[id].likes++;
            LikeArr.current[id].liked = true;
        }
        else{
            LikeArr.current[i].likes--;
            LikeArr.current[i].liked = false;
        }
    };

    const incComment = (id) => {
        LikeArr.current[id].comments++;
    };

    const shuffle = (array) => {
        let currentIndex = array?.length, randomIndex;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const generateTribeIds = () => {
        const arr = [];
        const tribeArr = [];
        for(let i = 0; i < tribeIds?.length; i++) arr.push(tribeIds[i]);
        const shuffledArr = shuffle(arr);
        const len = shuffledArr?.length>10?10:shuffledArr?.length===0?0:shuffledArr?.length;
        for(let i = 0; i < len; i++) tribeArr.push(shuffledArr[i]);
        return tribeArr;
    };

    const navToTribe = (tribeId) => {
        navigation.navigate('CreateTribe', { index: 1, tribeId: tribeId });
    };

    const navToProfile = (by, name) => {
        if(by===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', {
            id: by,
            username: name,
        });
    };

    const onCommentPress = (props) => {
        navigation.push('Comment', { ...props, timestamp: null, show: true });
    };

    const onEndReached = () => {
        if(array1.length>0){
            toggleIndicator(true);
            const arr = generateTribeIds();
            recommendNextPosts(setArray1, lastVisible, setLastVisible, limit, toggleIndicator, arr, addToLikeArr);
        }
    };

    const fetchPosts = async() => {
        setToggle((state) => !state);
        const arr = generateTribeIds();
        await recommendPosts(setArray1, setLastVisible, limit, arr, addToLikeArr);
        setToggle((state) => !state);
    };

    React.useEffect(() => {
        if(tribeIds?.length>0){
            if(render) return;
            fetchPosts();
            render = true;
        }
    }, [tribeIds]);

    const renderItem = React.useCallback(({item}) => (
        <PostBox 
        incLike={e => incLike(e, item.id)}
        incComment={() => incComment(item.id)}
        likes={LikeArr.current[item.id]?.likes}
        liked={LikeArr.current[item.id]?.liked}
        onCommentPress={() => onCommentPress(item)}
        comments={LikeArr.current[item.id]?.comments}
        onTribePress={() => navToTribe(item.tribeId)}
        onDpPress={() => navToProfile(item.by, item.name)}
        {...item}/>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        ref={scrollRef}
        estimatedItemSize={523}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<BottomIndicator/>}
        ListEmptyComponent={array1.length===0?<Empty/>:null}
        refreshControl={<RefreshControl refreshing={!toggle} onRefresh={fetchPosts} tintColor={Colors.textC2} progressBackgroundColor={Colors.bg2} colors={[Colors.textC1]}/>}/>
    ));

    if(profile?.tribe===0){
        const NewUser = require('./NewUser').default;
        return <NewUser/>;
    }else if(array1[0]==='_') return <Skeleton type='post'/>;

    return (

        <View flex>
            {body}
        </View>

    );

};

export default React.memo(PostView);