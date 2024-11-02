import React from 'react';
import Footer from './Footer';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { auth, useAnimation } from '../../hooks';
import { Dimensions, Keyboard } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { copyText, reportFunc, sendNotification } from '../../functions';
import { Icon, Message, Scroller, Menu, Skeleton } from '../../components';
import { DeleteMessage, fetchMessages, fetchNextMessages } from './helper';
import { View, Text, Colors, TouchableOpacity, Drawer } from 'react-native-ui-lib';

const unsubscribe = [];
const limit = 20;
const { width } = Dimensions.get('window');

let prevState = false;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function MessageScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, recipientId, recipientUserName, recipientDp, notification, myNotification } = route.params;

    const { ReplyStyle, Grow, UnGrow } = useAnimation();

    const [array1, setArray1] = React.useState('_');
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    const [reply, setReply] = React.useState({
        reply: false,
        replymsg: null,
        replyingto: null,
        relement: null,
    });

    const scrollRef = React.useRef(null);
    const newmsg = React.useRef(0);

    const ReplyFunc = (msg, to, element) => {
        setTimeout(() => { 
            setReply((data) => ({
                ...data,
                reply: true,
                replymsg: msg,
                replyingto: to,
                relement: element
            }));
        }, 100);
        Grow();
    };

    const cancelReply = () => {
        UnGrow();
        setTimeout(() => {
            setReply((data) => ({
                ...data,
                reply: false,
                replymsg: null,
                replyingto: null,
                relement: null
            }));
        }, 100);
    };

    const onScroll = (e) => {
        const { contentOffset } = e.nativeEvent;
        const currentState = contentOffset.y > 0;
        if(prevState!==currentState){
            prevState = currentState;
            setShowScrollButton(currentState);
        }
    };

    const onScrollClick = () => {
        setTimeout(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, 100);
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            fetchNextMessages(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    const goBack = () => {
        if(Keyboard.isVisible()) Keyboard.dismiss();
        else navigation.goBack();
    };

    const notify = (msg) => {
        sendNotification(true, false, false, recipientId, null, recipientUserName, msg, null, null, null, null);
    };

    React.useEffect(() => {
        fetchMessages(roomId, setArray1, unsubscribe, setLastVisible, limit);
        return () => {
            if(notification&&newmsg.current>0){
                const seen = array1[array1.length-1]?.seen;
                if(!seen){
                    const msg = `You have ${newmsg.current} unread messages from ${auth.currentUser.displayName}`;
                    notify(msg);
                }
            }
            for(let i = 0; i < unsubscribe.length; i++) unsubscribe[i]();
        };
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60M>{recipientUserName}</Text>,
            headerLeft: () => (
                <TouchableOpacity onPress={goBack}>
                    <View width={60} height={45} center bg-bg2
                    style={{ borderTopRightRadius: 30, borderBottomRightRadius: 30 }}>
                        <Icon name='chevron-left' size={30}/>
                    </View>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View marginR-22>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('ChatDetails', {
                            roomId: roomId,
                            recipientId: recipientId,
                            recipientUserName: recipientUserName,
                            recipientDp: recipientDp,
                            notification: myNotification,
                        });
                    }}>
                        <Image 
                        recyclingKey={recipientDp} 
                        source={{ uri: recipientDp }} 
                        placeholderContentFit='contain' 
                        placeholder='https://shorturl.at/PQTW4' 
                        style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bg2 }}/>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const Header = React.useMemo(() => (
        <View width='100%' center marginT-16>
            <Image 
            recyclingKey={recipientDp} 
            source={{ uri: recipientDp }} 
            placeholderContentFit='contain' 
            placeholder='https://shorturl.at/PQTW4' 
            style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.bg2 }}/>
            <Text textC1 text60M marginT-16>{recipientUserName}</Text>
        </View>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <Drawer 
        onSwipeableWillOpen={() => ReplyFunc(item?.message?.substring(0, 80) || item?.imageUrl, item.by, item.element)}
        rightItems={[{ background: Colors.bg1 }]}>
            <View width={width}>
                <Menu 
                triggerOnLongPress 
                options={[
                    {
                        icon: 'content-copy',
                        text: 'Copy',
                        color: Colors.textC2,
                        onPress: () => copyText(item?.message || ' ')
                    },
                    {
                        icon: item.by===auth.currentUser.uid?'trash':'flag',
                        text: item.by===auth.currentUser.uid?'Delete':'Report',
                        color: Colors.red,
                        type: 'feather',
                        onPress: () => {
                            if(item.by===auth.currentUser.uid) DeleteMessage(roomId, item.id, item?.imageUrl);
                            else reportFunc(`/messaging/${roomId}/message/${item.id}`);
                        }
                    }
                ]}
                children={
                    <Message 
                    index={index} 
                    dp={recipientDp}
                    msgLength={array1?.length} 
                    username={recipientUserName}
                    sMsgBy={array1[index===0?0:index-1]?.by} 
                    pMsgBy={array1[index===array1?.length-1?index:index+1]?.by}
                    {...item}/>
                }/>
            </View>
        </Drawer>
    ));

    const empty = React.useMemo(() => (
        <View flex center>
            {Header}
            <Text text60R textC1 marginT-6>Say Hi 👋</Text>
        </View>
    ));

    const body = React.useMemo(() => (
        <View flex>
            <FlashList
            inverted
            data={array1} 
            ref={scrollRef}
            onScroll={onScroll}
            estimatedItemSize={157}
            renderItem={renderItem} 
            keyExtractor={(i,x) => x} 
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            ListFooterComponent={Header}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false} />
            <Scroller show={showScrollButton} onPress={onScrollClick}/>
        </View>
    ));

    const textfield = React.useMemo(() => (
        <Footer 
        cancel={cancelReply} 
        nav={navigation} 
        reply={reply} 
        roomId={roomId} 
        rstyle={ReplyStyle} 
        username={recipientUserName} 
        newmsg={newmsg}/>
    ));

    if(array1==='_') return <Skeleton type='msg'/>;

    return (

        <View flex useSafeArea bg-bg1>
            {array1.length===0?empty:body}
            {textfield}
        </View>

    );

};