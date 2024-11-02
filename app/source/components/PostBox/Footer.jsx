import React from 'react';
import Icon from '../Icon';
import { Image } from 'expo-image';
import { auth } from '../../hooks';
import { Pressable, StyleSheet, Share } from 'react-native';
import { View, Text, Colors, TextField } from 'react-native-ui-lib';
import { formatNumber, postComment, sendNotification } from '../../functions';
import { disLikePost, likePost, modifyCommentNum } from '../../screens/tribe/post/helper';
import { useSharedValue, useAnimatedStyle, interpolate, Extrapolate, withSpring } from 'react-native-reanimated';

const sendComment = async(id, by, name, val, text, imgUrl, vidUrl, comments) => {
    await postComment(id, val).then((ref) => {
        modifyCommentNum(id, 1, val);
        if(by===auth.currentUser.uid) return;
        const params = {
            id: id,
            commentId: ref,
            ...text&&{ text: text },
            ...imgUrl&&{ imageUrl: imgUrl },
            ...vidUrl&&{ vidUrl: vidUrl },
        };
        const msg = comments>1?`${auth.currentUser.displayName} and ${comments} others commented on your post: "${val}"`:`${auth.currentUser.displayName} commented on your post: "${val}"`;
        sendNotification(true, false, true, by, null, name, msg, 'Post', params, auth.currentUser.photoURL, 'comment');
    });
};

const onShare = (id) => {
    Share.share({
        title: `See this post on Wყƚƚყ.`,
        message: `See this post on Wყƚƚყ.\nhttps://wytty.org/post/${id}`,
        url: `https://wytty.org/post/${id}`
    });
};

const Footer = ({
    id, 
    by, 
    name, 
    text, 
    imgUrl, 
    vidUrl, 
    likes, 
    lastComment, 
    comments, 
    liked, 
    onCommentPress, 
    onTribePress, 
    incLike, 
    incComment,
}) => {

    const commentRef = React.useRef(null);

    const [change, setChange] = React.useState({
        likes: likes,
        liked: liked,
        comments: comments,
    });

    const likedValue = useSharedValue(change.liked?1:0);

    const outlineStyle = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(likedValue.value, [0,1], [1,0], Extrapolate.CLAMP)}]}));
    const fillStyle = useAnimatedStyle(() => ({ transform: [{ scale: likedValue.value }], opacity: likedValue.value }));

    const onLike = () => {
        setChange(state => {
            if(state.liked){
                state.likes--;
                state.liked = false;
                likedValue.value = withSpring(0);
                incLike(false);
                disLikePost(id);
            }else{
                state.likes++;
                state.liked = true;
                likedValue.value = withSpring(1);
                incLike(true);
                likePost(id);
            }
            return state;
        });
    };

    const onSend = (val) => {
        if(val?.trim()?.length===0) return;
        commentRef.current?.clear();
        setChange(state => {
            state.comments++;
            incComment();
            sendComment(id, by, name, val, text, imgUrl, vidUrl, state.comments+1);
            return state;
        });
    };

    React.useEffect(() => {
        setChange({
            comments: comments,
            liked: liked,
            likes: likes,
        });
    }, []);

    const LikeView = React.useMemo(() => (
        <Pressable onPress={onLike}>
            <View reanimated style={[StyleSheet.absoluteFillObject, outlineStyle]}>
                <Icon name='like2' type='ant' color={Colors.icon}/>
            </View>
            <View reanimated style={[fillStyle]}>
                <Icon name='like1' type='ant' color={Colors.primary}/>
            </View>
        </Pressable>
    ));

    const lastcomment = React.useMemo(() => (
        <View row centerV marginL-13 maxWidth='45%'>
            <Text marginR-6 textC1 text80R numberOfLines={1} style={{ fontWeight: 'bold' }}>{lastComment?.name}</Text>
            <Text textC1 text80R numberOfLines={1}>{lastComment?.comment}</Text>
        </View>
    ));

    const NumView = React.useMemo(() => (
        <View row centerV marginL-22>
            <Text reanimated text80R textC2>{formatNumber(change.likes)} likes</Text>
            <Pressable onPress={onCommentPress}>
                <Text text80R textC2> • {formatNumber(change.comments)} replies</Text>
            </Pressable>
            {lastComment?lastcomment:null}
        </View>
    ));

    return (

        <View width='100%'>
            <View centerV row paddingH-22 spread width='100%' height={55}>
                <View row centerV>
                    {LikeView}
                    <View marginH-26>
                        <Pressable onPress={onCommentPress}>
                            <Icon 
                            name='reply' 
                            type='octicons' 
                            color={Colors.icon}/>
                        </Pressable>
                    </View>
                    <Pressable onPress={() => onShare(id)}>
                        <Icon 
                        name='send' 
                        type='feather' 
                        color={Colors.icon}/>
                    </Pressable>
                </View>
                {onTribePress?
                <Pressable onPress={onTribePress}>
                    <Icon 
                    size={28} 
                    name='dot' 
                    type='octicons' 
                    color={Colors.icon}/>
                </Pressable>:<View/>}
            </View>
            {NumView}
            <View paddingH-16 row centerV spread width='100%' height={60}>
                <View row centerV>
                    <Image recyclingKey={auth.currentUser.photoURL} source={{ uri: auth.currentUser.photoURL }} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.line }}/>
                    <TextField 
                    marginL-16
                    textC1 text70R 
                    maxLength={250} 
                    ref={commentRef} 
                    placeholder='Reply with a message...'
                    placeholderTextColor={Colors.textC2}
                    onSubmitEditing={e => onSend(e.nativeEvent.text)}/>
                </View>
            </View>
        </View>

    );

};

export default React.memo(Footer);