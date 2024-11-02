import React from 'react';
import Footer from './Footer';
import { Dimensions } from 'react-native';
import { auth, limits } from '../../../hooks';
import { FlashList } from '@shopify/flash-list';
import { View, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { copyText, reportFunc } from '../../../functions';
import { acceptRequest, delMsg, getAdminMsg, getNextAdminMsg, rejectRequest } from './helper';
import { EmptyState, Scroller, Menu, TMessage, RequestBox, Skeleton } from '../../../components';

const limit = 10;
const { width } = Dimensions.get('window');
const { uTLimit } = limits;

let prevState = false;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const AdminMsg = ({roomId, admin, unsubscribe}) => {

    const navigation = useNavigation();

    const scrollRef = React.useRef(null);

    const [array1, setArray1] = React.useState('_');
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    const navToProfile = (id, name) => {
        navigation.navigate('OthersProfile', {
            id: id,
            username: name
        });
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
        scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextAdminMsg(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getAdminMsg(roomId, setArray1, unsubscribe, setLastVisible, limit);
    }, [roomId]);

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='user-secret' 
        type='font-awesome' 
        title='No messages' 
        subtitle='No messages from admins'/>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <View width={width}>
            {item.element==='request'?
            <RequestBox 
            admin={admin}
            dp={item.dp} 
            name={item.name} 
            status={item.status}
            onAccept={() => acceptRequest(roomId, item.by, item.name, item.id, uTLimit)}
            onCancel={() => rejectRequest(roomId, item.id)}
            onUserPress={() => navToProfile(item.by, item.name)}/>
            :
            <Menu
            triggerOnLongPress
            options={[
                {
                    icon: 'content-copy',
                    text: 'Copy',
                    color: Colors.textC2,
                    onPress: () => copyText(item.message || item.imageUrl)
                },
                {
                    icon: item.by===auth.currentUser.uid?'trash':'flag',
                    text: item.by===auth.currentUser.uid?'Delete':'Report',
                    color: Colors.red,
                    type: 'feather',
                    onPress: () => {
                        if(item.by===auth.currentUser.uid) delMsg(roomId, item.id);
                        else reportFunc(`/tribe/${roomId}/admin/${item.id}`)
                    }
                }
            ]}
            children={
                <TMessage
                roomId={roomId} 
                index={index} 
                msgLength={array1?.length-1} 
                pmsgby={array1[index===array1?.length-1?index:index+1]?.by} 
                {...item}/>
            }/>}
        </View>
    ));

    const body = React.useMemo(() => (
        <View flex>
            <FlashList
            inverted
            data={array1}
            ref={scrollRef}
            onScroll={onScroll}
            estimatedItemSize={328}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.75}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<View height={26}/>}/>
            <Scroller show={showScrollButton} onPress={onScrollClick}/>
        </View>
    ));

    const textfield = React.useMemo(() => (
        <Footer 
        admin={admin} 
        roomId={roomId}/>
    ));

    if(array1==='_') return <Skeleton type='msg'/>;

    return (

        <View flex>
            {array1.length===0?empty:body}
            {textfield}
        </View>

    );

};

export default React.memo(AdminMsg);