import React from 'react';
import { Image } from 'expo-image';
import { auth, limits } from '../../hooks';
import Toast from 'react-native-toast-message';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, CommentBox, Icon, Input, PostBox } from '../../components';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, FlatList, Pressable } from 'react-native';
import { deleteComment, getComments, getMoreComments, sendNotification, replyComment, disLikeComment, likeComment } from '../../functions';

const limit = 10;
const { width } = Dimensions.get('window');
const isAndorid = Platform.OS==='android';
const { pTextLen } = limits;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Comment() {

    const navigation = useNavigation();
    const route = useRoute();
    const { id, show } = route.params;

    const text = React.useRef('');
    const textRef = React.useRef(null);

    const [reply, setReply] = React.useState({
        reply: false,
        replymsg: null,
        replyingto: null,
        relement: null,
        ruid: null,
    });

    const [array1, setArray1] = React.useState('_');

    const nav = (userId, name) => {
        if(userId===auth.currentUser.uid) return;
        navigation.push('OthersProfile', { id: userId, name: name });
    };

    const onreplyPress = (cid, userId, name, index) => {
        setTimeout(() => {
            setReply(state => ({
                ...state,
                reply: true,
                ruid: cid,
                replyingto: userId,
                replymsg: name,
                relement: index
            }));
        }, 100);
    };

    const onDelete = (commentId) => {
        deleteComment(commentId).then(() => {
            setArray1((prev) => prev.filter(obj => obj.id !== commentId));
        }).catch(() => {
            Toast.show({ text1: "Couldn't process your request" });
        });
    };

    const replytocomment = (prop) => {
        if(text.current?.trim().length===0) return;
        const msg = text.current?.trim();
        textRef.current?.clear();
        replyComment(prop.ruid, msg).then((ref) => {
            setArray1((prev) => {
                const comments = [...prev];
                const comment = comments[prop.relement];
                comment.replies += 1;
                if(prop.replyingto!==auth.currentUser.uid){
                    const params = {
                        id: comment.id,
                        commentId: ref,
                        text: comment.message,
                    };
                    const msgg = comment.replies>1?`${auth.currentUser.displayName} and ${comment.replies} others subplied on your reply`:`${auth.currentUser.displayName} subplied on your reply"`;
                    sendNotification(true, false, true, prop.replyingto, null, prop.replymsg, msgg, 'Post', params, auth.currentUser.photoURL, 'comment');
                }
                return comments;
            });
        });
    };

    const onCommentLike = (id, index) => {
        setArray1((prev) => {
            const comments = [...prev];
            const comment = comments[index];
            if(comment.liked){
                comment.likes -= 1;
                comment.liked = false;
                disLikeComment(id);
            }else{
                comment.likes += 1;
                comment.liked = true;
                likeComment(id);
            }
            return comments;
        });
    };

    const toggleReply = () => {
        setTimeout(() => {
            setReply(state => ({
                ...state,
                reply: false,
            }));
        }, 100);
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getMoreComments(id, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getComments(id, setArray1, setLastVisible, limit);
    }, []);

    React.useEffect(() => {
        Keyboard.addListener(isAndorid?'keyboardDidHide':'keyboardWillHide', toggleReply);
        return () => {
            Keyboard.addListener(isAndorid?'keyboardDidHide':'keyboardWillHide', toggleReply).remove();
        }
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>Replies</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <PostBox 
        onDpPress={() => {
            if(route.params?.by===auth.currentUser.uid) return;
            navigation.navigate('OthersProfile', {
                id: route.params?.by,
                name: route.params?.name,
            });
        }}
        {...route.params}/>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <CommentBox 
        onPress={() => nav(item.by, item.name)} 
        onDelete={onDelete} 
        onLikePress={() => onCommentLike(item.id, index)}
        onReplyPress={() => onreplyPress(item.id, item.by, item.name, index)}
        viewSubply={() => navigation.push('Comment', { by: item.by , id: item.id, show: false })}
        {...item}/>
    ));

    const textbox = React.useMemo(() => (
        <View width={width} paddingV-6 bg-bg2>
            <Text text70R primary marginL-16 marginV-6>Replying to {reply.replymsg}</Text>
            <View row centerV paddingH-16 width={width} minHeight={50} maxHeight={120}>
                <Image recyclingKey={auth.currentUser.photoURL} source={{ uri: auth.currentUser.photoURL }} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg2 }}/>
                <Input
                autoFocus
                ref={textRef} onChange={e => text.current=e}
                len={pTextLen} multi w={width*0.75}
                placeholder='Write your reply...'/>
                <Pressable onPress={() => replytocomment(reply)}>
                    <View flex center>
                        <Icon name='send' type='feather' color={Colors.textC1}/>
                    </View>
                </Pressable>
            </View>
        </View>
    ));

    const empty = React.useMemo(() => (
        <View width={width} center marginV-56>
            <Text textC2 text70R center>{array1==='_'?'Loading replies':'No replies'}</Text>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            <KeyboardAvoidingView behavior={isAndorid?null:'padding'} keyboardVerticalOffset={100} style={{ flex: 1 }}>
                <FlatList
                renderItem={renderItem}
                keyExtractor={(i,x) => x}
                ListEmptyComponent={empty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.75}
                data={array1==='_'?[]:array1}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={show?header:null}/>
                {reply.reply?textbox:null}
            </KeyboardAvoidingView>
        </View>

    );

};