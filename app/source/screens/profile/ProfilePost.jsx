import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { View, Text } from 'react-native-ui-lib';
import { getNextUserPost, getUserPost } from './helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, EmptyState, Loader, PostBox } from '../../components';

const limit = 6;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function ProfilePost() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id, username, dp } = route.params;

    const LikeArr = React.useRef({});

    const [array1, setArray1] = React.useState('_');

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

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextUserPost(id, setArray1, lastVisible, setLastVisible, limit, addToLikeArr);
        }
    };

    const onCommentPress = (props) => {
        navigation.push('Comment', { ...props, timestamp: null, show: true });
    };

    React.useEffect(() => {
        getUserPost(id, setArray1, setLastVisible, limit, addToLikeArr);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>{username}</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const renderItem = React.useCallback(({item}) => (
        <PostBox 
        dp={dp} 
        onDpPress={() => {}} 
        incLike={e => incLike(e, item.id)}
        incComment={() => incComment(item.id)}
        likes={LikeArr.current[item.id]?.likes}
        liked={LikeArr.current[item.id]?.liked}
        onCommentPress={() => onCommentPress(item)}
        comments={LikeArr.current[item.id]?.comments}
        {...item}/>
    ));

    const empty = React.useMemo(() => (
        <EmptyState
        icon='icons'
        type='font-awesome'
        title='No posts'
        subtitle='You will see public tribe post shared over here'/>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        estimatedItemSize={343}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.85}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            {array1.length===0?empty:body}
        </View>

    );

};