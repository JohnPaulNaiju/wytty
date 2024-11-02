import React from 'react';
import Post from './post/Post';
import { Image } from 'expo-image';
import { useNotify } from '../../hooks';
import AdminMsg from './admin/AdminMsg';
import { Icon } from '../../components';
import { Keyboard } from 'react-native';
import PollScreen from './poll/PollScreen';
import FileScreen from './file/FileScreen';
import { updateNum } from '../home/helper';
import { formatNumber } from '../../functions';
import TMessageScreen from './messages/TMessageScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Colors, TabController, Badge, TouchableOpacity, Text } from 'react-native-ui-lib';

const unsubscribe = [];

export default function TribeMain (){

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, title, meAdmin, Public, admin, msg, post, poll, file, mention, population, verified, dp, category } = route.params;

    const { notify } = useNotify();

    const [msgnum, setMsgnum] = React.useState({
        admin: admin,
        msg: msg,
        post: post,
        poll: poll,
        file: file,
        mention: mention,
    });

    const badge = React.useCallback((num) => (
        num>0?<Badge marginL-6 label={formatNumber(num)} size={16} backgroundColor={Colors.primary} white labelStyle={{ color: Colors.white }}/>:null
    ));

    const screens = React.useMemo(() => [
        { label: 'Post', trailingAccessory: badge(msgnum.post) }, 
        { label: 'Chat', trailingAccessory: badge(msgnum.msg) }, 
        { label: 'Broadcast', trailingAccessory: badge(msgnum.admin) }, 
        { label: 'Poll', trailingAccessory: badge(msgnum.poll) }, 
        { label: 'File', trailingAccessory: badge(msgnum.file) }, 
    ]);

    const changeMsgnum = (index) => {
        try{
            let numType;
            switch(index){
                case 0:
                    numType = 'post';
                    break;
                case 1:
                    numType = 'msg';
                    break;
                case 2:
                    numType = 'admin';
                    break;
                case 3:
                    numType = 'poll';
                    break;
                case 4:
                    numType = 'file';
                    break;
                default:
                    numType = 'post';
                    break;
            }
            if(msgnum?.[`${numType}`]>0) updateNum(roomId, numType, msgnum?.[`${numType}`]);
            setTimeout(() => {
                setMsgnum(state => ({
                    ...state,
                    [`${numType}`]: 0
                }));
            }, 100);
        }catch{}
    };

    const onMentionPress = () => {
        try{
            navigation.navigate('Mention', { 
                roomId: roomId, 
                title: title,
            });
            if(mention>0) updateNum(roomId, 'mention', -mention);
            setTimeout(() => {
                setMsgnum(state => ({
                    ...state,
                    mention: 0
                }));
            }, 100);
        }catch{}
    };

    const back = () => {
        if(Keyboard.isVisible()) Keyboard.dismiss();
        else navigation.goBack();
    };

    React.useEffect(() => {
        return () => {
            for(let i = 0; i < unsubscribe.length; i++) unsubscribe[i]();
        }
    }, [roomId]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            headerLeft: () => (
                <TouchableOpacity onPress={back}>
                    <View width={60} height={45} center bg-bg2
                    style={{ borderTopRightRadius: 30, borderBottomRightRadius: 30 }}>
                        <Icon size={28} name='keyboard-arrow-left'/>
                        {notify.tribe>0?
                        <View absT absR>
                            <Badge size={14} white label={formatNumber(notify.tribe)} backgroundColor={Colors.primary} labelStyle={{ color: Colors.white }}/>
                        </View>
                        :null}
                    </View>
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <View row centerV paddingR-42>
                    <Text text60 textC1 numberOfLines={1} marginR-8>{title}</Text>
                    {verified?<Icon name='verified' size={18}/>:null}
                </View>
            ),
            headerRight: () => (
                <View spread row centerV paddingR-16>
                    <TouchableOpacity marginR-16 onPress={onMentionPress}>
                        <View>
                            <Icon name='at-sign' type='feather' size={20}/>
                            {msgnum.mention>0?
                            <View absT absR marginTop={-4} marginRight={-4}>
                                <Badge size={14} white label={formatNumber(msgnum.mention)} 
                                backgroundColor={Colors.primary} labelStyle={{ color: Colors.white }}/>
                            </View>:null}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('TribeDetails', {...route.params})}>
                        <Image 
                        recyclingKey={dp}
                        source={{ uri: dp }}
                        placeholderContentFit='contain' 
                        placeholder='https://shorturl.at/PQTW4' 
                        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bg2 }}/>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [roomId, notify.tribe, msgnum.mention]);

    return (

        <View flex useSafeArea bg-bg1>
            <TabController asCarousel items={screens} onChangeIndex={(i) => changeMsgnum(i)}>
                <TabController.TabBar 
                labelColor={Colors.textC2} 
                backgroundColor={Colors.bg1} 
                selectedLabelColor={Colors.textC1} 
                indicatorStyle={{ backgroundColor: Colors.textC1 }}
                containerStyle={{ 
                    borderBottomWidth: 1, 
                    borderBottomColor: Colors.line, 
                }}/>
                <View flex>
                    <TabController.PageCarousel keyboardShouldPersistTaps='handled'>
                        <TabController.TabPage index={0} lazy>
                            <Post roomId={roomId} Public={Public} population={population} category={category}/>
                        </TabController.TabPage>
                        <TabController.TabPage index={1} lazy>
                            <TMessageScreen roomId={roomId} unsubscribe={unsubscribe} population={population} category={category}/>
                        </TabController.TabPage>
                        <TabController.TabPage index={2} lazy>
                            <AdminMsg admin={meAdmin} roomId={roomId} unsubscribe={unsubscribe}/>
                        </TabController.TabPage>
                        <TabController.TabPage index={3} lazy>
                            <PollScreen roomId={roomId} unsubscribe={unsubscribe}/>
                        </TabController.TabPage>
                        <TabController.TabPage index={4} lazy>
                            <FileScreen roomId={roomId} title={title} unsubscribe={unsubscribe}/>
                        </TabController.TabPage>
                    </TabController.PageCarousel>
                </View>
            </TabController>
        </View>

    );

};