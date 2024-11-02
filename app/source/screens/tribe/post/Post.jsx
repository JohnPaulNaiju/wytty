import React from 'react';
import { auth } from '../../../hooks';
import { FlashList } from '@shopify/flash-list';
import { getNextPost, getPost } from './helper';
import { RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Colors, Card  } from 'react-native-ui-lib';
import { PostBox, Icon, Skeleton } from '../../../components';

const limit = 15;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const Empty = () => {

    const PostEmpty = require('../../home/PostEmpty').default;
    return <PostEmpty big/>;

};

const Post = ({roomId, Public, category}) => {

    const navigation = useNavigation();

    const LikeArr = React.useRef({});

    const [array1, setArray1] = React.useState(['_']);
    const [toggle, setToggle] = React.useState(true);

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
        if(array1.length>=limit){
            getNextPost(roomId, setArray1, lastVisible, setLastVisible, limit, addToLikeArr);
        }
    };

    const fetchPosts = async() => {
        setToggle((state) => !state);
        await getPost(roomId, setArray1, setLastVisible, limit, addToLikeArr);
        setToggle((state) => !state);
    };

    React.useEffect(() => {
        fetchPosts();
    }, [roomId]);

    const renderItem = React.useCallback(({item}) => (
        <PostBox 
        incLike={e => incLike(e, item.id)}
        incComment={() => incComment(item.id)}
        likes={LikeArr.current[item.id]?.likes}
        liked={LikeArr.current[item.id]?.liked}
        onCommentPress={() => onCommentPress(item)}
        comments={LikeArr.current[item.id]?.comments}
        onDpPress={() => navToProfile(item.by, item.name)} 
        {...item}/>
    ));

    const createbt = React.useMemo(() => (
        <View absB absR>
            <Pressable onPress={() => navigation.navigate('CreatePost', { roomId: roomId, Public: Public, category: category })}>
                <Card width={58} height={58} borderRadius={30} margin-16>
                    <View width={58} height={58} borderRadius={30} center bg-primary>
                        <Icon name='feather' type='material-community' size={28}/>
                    </View>
                </Card>
            </Pressable>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        estimatedItemSize={394}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={array1.length===0?<Empty/>:null}
        refreshControl={<RefreshControl refreshing={!toggle} onRefresh={fetchPosts} tintColor={Colors.textC2} progressBackgroundColor={Colors.bg2} colors={[Colors.textC1]}/>}/>
    ));

    if(array1[0]==='_') return <Skeleton type='post'/>

    return (

        <View flex>
            {body}
            {createbt}
        </View>

    );

};

export default React.memo(Post);