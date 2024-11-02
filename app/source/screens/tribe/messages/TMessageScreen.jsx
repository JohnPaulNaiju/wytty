import React from 'react';
import Footer from './Footer';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import { View, Colors } from 'react-native-ui-lib';
import { auth, useAnimation } from '../../../hooks';
import { useNavigation } from '@react-navigation/native';
import { copyText, reportFunc } from '../../../functions';
import { EmptyState, Scroller, TMessage, Menu, Skeleton } from '../../../components';
import { DeleteMessage, fetchMessages, fetchNextMessages, summarize } from './helper';

const limit = 20;
let prevState = false;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const TMessageScreen = ({roomId, unsubscribe, population, category})  => {

    const navigation = useNavigation();

    const { ReplyStyle, Grow, UnGrow } = useAnimation();

    const scrollRef = React.useRef(null);

    const [reply, setReply] = React.useState({
        reply: false, 
        replymsg: null, 
        replyingto: null, 
        relement: null, 
        ruid: null, 
    });

    const [array1, setArray1] = React.useState('_');
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    const ReplyFunc = (msg, by, element, ruid) => {
        if(element==='poll'||element==='note'||element==='file'){
            Toast.show({ text1: `Mentioning ${element} currently not supported` });
            return;
        }
        setTimeout(() => { 
            setReply((data) => ({ 
                ...data, 
                reply: true, 
                replymsg: msg, 
                replyingto: by, 
                relement: element, 
                ruid: ruid,
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
                relement: null, 
                ruid: null, 
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

    const navToReport = (userId) => {
        navigation.navigate('Report', { 
            roomId: roomId, 
            userId: userId, 
            population: population
        });
    };

    React.useEffect(() => {
        fetchMessages(roomId, setArray1, unsubscribe, setLastVisible, limit);
    }, [roomId]);

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='message1'
        type='ant'
        title='No messages' 
        subtitle='Start messaging now'/>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <Menu 
        triggerOnLongPress
        options={[
            {
                icon: 'at-sign',
                text: 'Mention',
                color: Colors.textC2,
                type: 'feather',
                onPress: () => ReplyFunc(item?.message?.substring(0, 80) || item?.imageUrl, item.name, item.element, item.by)
            },
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
                    else reportFunc(`/tribe/${roomId}/message/${item.id}`);
                }
            },
            {
                icon: 'person-remove',
                text: 'Kickout',
                color: Colors.red,
                type: 'ion',
                onPress: () => navToReport(item.by),
            },
        ]}
        children={
            <TMessage 
            roomId={roomId} 
            index={index} 
            msgLength={array1?.length-1} 
            pmsgby={array1[index===array1?.length-1?index:index+1]?.by} 
            {...item}/>
        }/>
    ));

    const body = React.useMemo(() => (
        <View flex>
            <FlashList
            inverted
            data={array1}
            ref={scrollRef}
            onScroll={onScroll}
            estimatedItemSize={186}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.75}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<View height={30}/>}/>
            <Scroller show={showScrollButton} onPress={onScrollClick}/>
        </View>
    ));

    const textfield = React.useMemo(() => (
        <Footer 
        reply={reply} 
        roomId={roomId} 
        rstyle={ReplyStyle} 
        category={category} 
        cancel={cancelReply} 
        summarize={() => summarize(array1)}/>
    ));

    if(array1==='_') return <Skeleton type='msg'/>;

    return (

        <View flex useSafeArea>
            {array1.length===0?empty:body}
            {textfield}
        </View>

    );

};

export default React.memo(TMessageScreen);