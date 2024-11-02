import React from 'react';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth, useData, limits } from '../../hooks';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, RefreshControl, FlatList } from 'react-native';
import { CreateChat, deleteChat, getRoomId } from '../connection/helper';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';
import { openLink, formatNumber, reportFunc, timeAgo, getDp } from '../../functions';
import { ActionSheet, AvatarGroup, Back, Icon, ListItemWithIcon, Loader, PostBox, TribeBox } from '../../components';
import { Connect, DisConnect, Request, UnRequest, getUserSinglePost, getUserSingleTribe, rejectRequest } from './helper';

const { width } = Dimensions.get('window');
const { cLimit } = limits;

export default function OthersProfile() {

    const abortController = new AbortController();

    const navigation = useNavigation();
    const routes = useRoute();

    const { username, id } = routes.params;

    const { profile } = useData();

    const [index, setIndex] = React.useState(0);
    const [array1, setArray1] = React.useState('_');
    const [toggle, setToggle] = React.useState(true);

    const [post, setPost] = React.useState([]);
    const [tribe, setTribe] = React.useState([]);
    const [url, setUrl] = React.useState([]);

    const [loading, setLoading] = React.useState({
        loading: true,
        refreshing: false,
    });

    const connectionText = () => {
        switch(index){
            case 0:
                return 'Loading';
            case 1:
                return 'Connected';
            case 2:
                return 'Requested';
            case 3:
                return 'Accept';
            case 4:
                return 'Connect';
            default:
                return 'Loading';
        }
    };

    const CheckStatus = React.useCallback(async() => {

        const docRef1 = doc(db, 'user', id, 'connection', auth.currentUser.uid);
        const docRef2 = doc(db, 'user', id, 'request_r', auth.currentUser.uid);
        const docRef3 = doc(db, 'user', auth.currentUser.uid, 'request_r', id);

        const connectionRef = await getDoc(docRef1, { signal: abortController.signal });
        if(connectionRef.exists()){
            setIndex(1);
            return;
        }

        const requestRef = await getDoc(docRef2, { signal: abortController.signal });
        if(requestRef.exists()){
            setIndex(2);
            return;
        }

        const acceptRef = await getDoc(docRef3, { signal: abortController.signal });
        if(acceptRef.exists()){
            setIndex(3);
            return;
        }

        setIndex(4);
    }, [setIndex]);

    const getProfileData = React.useCallback(async() => {

        setLoading((state) => ({ ...state, refreshing: true }));

        const userRef = doc(db, 'user', id);

        const userData = await getDoc(userRef, { signal: abortController.signal }).catch(() => {
            Toast.show({ text1: 'Cannot process your request' });
            navigation.goBack();
            return;
        });

        if(!userData.exists()){
            Toast.show({ text1: 'Cannot find user' });
            navigation.goBack();
            return;
        }

        if(abortController.signal.aborted) return;

        setArray1(userData.data());

        setLoading((state) => ({ ...state, refreshing: false, loading: false }));

        CheckStatus();
        getUserSinglePost(id, setPost, abortController.signal);
        getUserSingleTribe(id, setTribe, abortController.signal);

        const arr = [];
        const dpArr = userData.data()?.connectionId;
        for(let i = 0; i < dpArr?.length || 0; i++){
            if(i===2) break;
            const uri = await getDp(dpArr[i]);
            arr.push(uri);
        }
        setUrl(arr);

    }, [setLoading, setArray1]);

    const handleOpen = React.useCallback(() => {
        setToggle(state => !state);
    }, [setToggle]);

    const remove = () => {
        setTimeout(() => {
            setIndex(4);
            DisConnect(id);
            const roomId = getRoomId(id);
            deleteChat(roomId);
        }, 200);
    };

    const delreq = () => {
        setTimeout(() => {
            setIndex(4);
            UnRequest(id);
        }, 200);
    };

    const accept = () => {
        if(array1?.connection>=cLimit||profile?.connection>=cLimit){
            Toast.show({ text1: `A user can have only ${cLimit}` });
            return;
        }
        setTimeout(() => {
            setIndex(1);
            Connect(id, array1?.username, array1?.token);
            const roomId = getRoomId(id);
            CreateChat(roomId, id, array1?.username);
        }, 200);
    };

    const reject = () => {
        setTimeout(() => {
            setIndex(4);
            rejectRequest(id);
        }, 200);
    };

    const send = () => {
        if(array1?.connection>=cLimit||profile?.connection>=cLimit){
            Toast.show({ text1: `A user can have only ${cLimit}` });
            return;
        }
        setTimeout(() => {
            setIndex(2);
            Request(id, array1?.username, array1?.token);
        }, 200);
    };

    const navToChat = () => {
        const roomId = getRoomId(id);
        navigation.navigate('MessageScreen', {
            roomId: roomId,
            recipientId: id,
            recipientUserName: username || array1?.username,
            recipientDp: array1?.dplink || 'https://shorturl.at/PQTW4',
            notification: true,
            myNotification: true,
        });
    };

    React.useEffect(() => {
        if(id===auth.currentUser.uid){ 
            navigation.goBack();
            return;
        }
        getProfileData();
        return () => abortController.abort();
    } ,[navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60M marginR-6>{username || array1?.username}</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                <TouchableOpacity padding-8 marginR-16 onPress={handleOpen}>
                    <Text text40 textC1>:</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, array1]);

    const children = React.useMemo(() => (
        <View width={width} centerH>
            { index===1?
            <View width={width} centerH>
                <Text textC2 center>Remove connection with {array1?.username}{"\n"}You will have to request again if you change your mind</Text>
                <View width={width*0.9} br40 bg-line marginT-16>
                    <ListItemWithIcon
                    color={Colors.red}
                    icon='minus-circle'
                    type='feather'
                    title='Remove connection'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            remove();
                        }, 200);
                    }}/>
                </View>
                <View width={width*0.9} height={0.7} bg-bg2/>
                <View width={width*0.9} br40 bg-line >
                    <ListItemWithIcon
                    icon='message-square'
                    type='feather'
                    title='Message'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            navToChat();
                        }, 200);
                    }}/>
                </View>
            </View> : null }
            { index===2?
            <View width={width} centerH>
                <Text textC2 center>Delete connection request send to {array1?.username}</Text>
                <View width={width*0.9} br40 bg-line marginT-16>
                    <ListItemWithIcon
                    color={Colors.red}
                    icon='trash'
                    type='feather'
                    title='Delete request'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            delreq();
                        }, 200);
                    }}/>
                </View>
            </View> : null }
            { index===3?
            <View width={width} centerH>
                <Text textC2 center marginB-16>Accept/Reject connection request from {array1?.username}`</Text>
                <View width={width*0.9} br40 bg-line>
                    <ListItemWithIcon
                    icon='user-check'
                    type='feather'
                    title='Accept request'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            accept();
                        }, 200);
                    }}/>
                    <View width={width*0.9} height={0.7} bg-bg2/>
                    <ListItemWithIcon
                    color={Colors.red}
                    icon='user-x'
                    type='feather'
                    title='Reject request'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            reject();
                        }, 200);
                    }}/>
                </View>
            </View> : null }
            { index===4?
            <View width={width} centerH>
                <Text textC2 center marginB-16>Send connection request to {array1?.username}</Text>
                <View width={width*0.9} br40 bg-line marginT-16>
                    <ListItemWithIcon
                    icon='user-plus'
                    type='feather'
                    title='Send connection request'
                    onPress={() => {
                        handleOpen();
                        setTimeout(() => {
                            send();
                        }, 200);
                    }}/>
                </View>
            </View> : null }
            {(array1?.linkedin||array1?.donate)?
            <View width={width*0.9} br40 bg-line marginT-26>
                {array1?.linkedin?
                <ListItemWithIcon
                color={Colors.blue30}
                icon='linkedin-square'
                type='ant'
                title="Connect with me on LinkedIn"
                onPress={() => {
                    handleOpen();
                    setTimeout(() => {
                        openLink(array1?.linkedin);
                    }, 100);
                }}/>:null}
                {(array1?.linkedin&&array1?.donate)?
                <View width={width*0.9} height={0.7} bg-bg2/>:null}
                {array1?.donate?
                <ListItemWithIcon
                color={Colors.yellow20}
                icon='coffee'
                type='feather'
                title="Buy me a coffee"
                onPress={() => {
                    handleOpen();
                    setTimeout(() => {
                        openLink(array1?.donate);
                    }, 100);
                }}/>:null}
            </View>:null}
            <View width={width*0.9} br40 bg-line marginT-26>
                <ListItemWithIcon
                color={Colors.red}
                icon='flag'
                type='feather'
                title='Report'
                onPress={() => {
                    handleOpen();
                    setTimeout(() => {
                        reportFunc(`/user/${id}`);
                    }, 200);
                }}/>
            </View>
            <Text text70R textC2 marginV-6>Joined {timeAgo(array1?.joined?.toDate())} ago</Text>
        </View>
    ));

    const action = React.useMemo(() => (
        <ActionSheet 
        open={!toggle} 
        close={handleOpen} 
        children={children}/>
    ));

    const header = React.useMemo(() => (
        <View centerH width={width}>
            <View width={width} borderRadius={28} bg-bg1>
                <View row centerV padding-16 width={82}>
                    <Image 
                    recyclingKey={array1?.dplink} 
                    placeholderContentFit='contain' 
                    source={{ uri: array1?.dplink }} 
                    placeholder='https://shorturl.at/PQTW4' 
                    style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bg2 }}/>
                    { array1?.verified ? 
                    <View absT absR marginT-60>
                        <Icon name='verified' size={18}/>
                    </View> : null }
                </View>
                <View paddingL-16 paddingR-106>
                    { array1?.name? <Text text60 textC1 marginR-8>{array1?.name}</Text> : null }
                    { array1?.bio ? <Text text70R textC1 marginT-6>{array1?.bio}</Text> : null }
                    { array1?.link?
                    <TouchableOpacity marginT-6 centerV row onPress={() => openLink(array1?.link)}>
                        <Icon name='link' type='ion' size={18}/>
                        <Text textC1 marginL-6 marginR-106 center numberOfLines={1}>{array1?.link}</Text>
                    </TouchableOpacity> : null }
                </View>
                <View width={width} marginV-4 paddingH-16 row centerV>
                    {array1?.connection>0?
                    <View row centerV>
                        <AvatarGroup url={url} size={20} num={array1?.connection-2||0} color={Colors.bg2}/>
                        <Text textC2 text80 marginL-6>connections • </Text>
                    </View>
                    :null}
                    <Text textC2 text80>{formatNumber(array1?.tribe||0)} tribes</Text>
                </View>
                <View width={width} paddingH-6 row centerV marginT-6>
                    <View marginL-8 row centerV br60 paddingH-6 paddingV-4 bg-green>
                        <View padding-3 br40 bg-white>
                            <Icon name='fire' type='font-awesome' size={12} color={Colors.bg1}/>
                        </View>
                        <Text bg1 text90 marginL-6 style={{ fontWeight: 'bold' }}>{formatNumber(array1?.woint||0)} WP</Text>
                    </View>
                    <View flex row>
                        { array1?.bot?
                        <View row centerV br60 bg-line paddingH-8 paddingV-6 marginL-6>
                            <Icon name='dependabot' type='octicons' color={Colors.textC2} size={16}/>
                            <Text textC2 text90R marginL-6>Bot account</Text>
                        </View>:null}
                        <View flex/>
                    </View>
                </View>
                <View width={width} height={60} center marginT-4>
                    <TouchableOpacity padding-6 onPress={handleOpen}>
                        <View width={width*0.95} height={40} center br30 backgroundColor={index===4?Colors.primary:Colors.bg2}>
                            <Text text70 textC1 style={{ fontWeight: 'bold' }}>{connectionText()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {post[0]?
                <View width={width}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfilePost', { id: id, username: username || array1?.username, token: array1?.token, dp: array1?.dplink })}>
                        <View width={width} height={50} centerV row spread paddingH-16>
                            <Text text60 textC1>Posts</Text>
                            <Icon name='arrowright' type='ant' color={Colors.textC1}/>
                        </View>
                    </TouchableOpacity>
                    <PostBox
                    dp={array1?.dplink} 
                    hide fullHide
                    {...post[0]}/>
                </View>:null}
                {tribe[0]?
                <View width={width}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileTribe', { id: id, username: username|| array1?.username })}>
                        <View width={width} height={50} centerV row spread paddingH-16>
                            <Text text60 textC1>Tribes</Text>
                            <Icon name='arrowright' type='ant' color={Colors.textC1}/>
                        </View>
                    </TouchableOpacity>
                    <TribeBox r
                    route='TribeInfo' 
                    {...tribe[0]}/>
                </View>:null}
            </View>
        </View>
    ));

    if(loading.loading) return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={200}/>}
            refreshControl={<RefreshControl refreshing={loading.refreshing} onRefresh={getProfileData} tintColor={Colors.textC2} progressBackgroundColor={Colors.bg2} colors={[Colors.textC1]}/>}/>
            { toggle ? null : action }
        </View>

    );

};