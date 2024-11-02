import React from 'react';
import { Image } from 'expo-image';
import { auth } from '../../../hooks';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import { SaveMessage } from '../messages/helper';
import { getMentions, getNextMentions } from './helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { copyText, reportFunc, sendNotification } from '../../../functions';
import { Back, EmptyState, Icon, Input, Loader, Menu, TMessage } from '../../../components';

const limit = 10;
const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Mention() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, title } = route.params;

    const text = React.useRef('');
    const inpRef = React.useRef(null);

    const [array1, setArray1] = React.useState('_');

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextMentions(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    const send = async(i) => {
        const msg = text.current?.trim();
        if(msg.length===0) return;
        inpRef.current?.clear();

        const reply = {
            ruid: array1[i].by,
            reply: true,
            replymsg: array1[i].message || array1[i].imageUrl,
            replyingto: array1[i].name,
            relement: 'text',
        };

        Toast.show({ text1: 'Reply sent 🎉' });

        await SaveMessage(roomId, msg, 'text', null, reply).then(() => {
            const message = `${auth.currentUser.displayName} mentioned you in ${title}: ${msg}`;
            sendNotification(true, false, false, reply.ruid, null, reply.replyingto, message, null, null, null, null);
        }).catch(() => {
            Toast.show({ text1: "Couldn't process your request" });
        });
    };

    React.useEffect(() => {
        getMentions(roomId, setArray1, setLastVisible, limit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View>
                    <Text textC1 text60>Mentions</Text>
                    <Text textC2 text80R>{title}</Text>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const empty = React.useMemo(() => (
        <EmptyState 
        fullHeight
        icon='at-sign' 
        type='feather'
        title='No mentions' 
        subtitle='Your mentions will appear here'/>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <Menu 
        triggerOnLongPress
        options={[
            {
                text: 'Copy',
                icon: 'content-copy',
                color: Colors.textC2,
                onPress: () => copyText(item?.message || ' ')
            },
            {
                text: 'Report',
                icon: 'flag',
                color: Colors.red,
                type: 'feather',
                onPress: () => reportFunc(`/tribe/${roomId}/message/${item.id}`)
            }
        ]}
        children={
            <View width={width} centerH marginT-16>
                <View width={width*0.9} bg-bg2 padding-6 br60>
                    <TMessage
                    index={index}
                    msgLength={0}
                    allDetails
                    onPress={() => {}}
                    {...item}/>
                    <View row centerV paddingH-16 spread>
                        <Image 
                        placeholderContentFit='contain' 
                        placeholder='https://shorturl.at/PQTW4' 
                        recyclingKey={auth.currentUser.photoURL} 
                        source={{ uri: auth.currentUser.photoURL }} 
                        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.bg2 }}/>
                        <Input ref={inpRef} placeholder='Reply...' w={width*0.65} onChange={e => text.current=e}/>
                        <TouchableOpacity padding-6 onPress={() => send(index)}>
                            <Icon name='feather' type='feather' color={Colors.textC2} size={20}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }/>
    ));

    const body = React.useMemo(() => (
        <KeyboardAvoidingView 
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
        behavior={isAndroid?null:'padding'}>
            <FlashList
            data={array1} 
            estimatedItemSize={176}
            renderItem={renderItem} 
            keyExtractor={(i,x) => x} 
            ListEmptyComponent={empty} 
            onEndReached={onEndReached} 
            onEndReachedThreshold={0.75} 
            keyboardShouldPersistTaps='handled' 
            showsVerticalScrollIndicator={false} 
            ListFooterComponent={<View height={30}/>}/>
        </KeyboardAvoidingView>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            
            {array1.length===0?empty:body}
        </View>

    );

};