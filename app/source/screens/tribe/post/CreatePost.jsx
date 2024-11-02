import React from 'react';
import { Image } from 'expo-image';
import { createPost } from './helper';
import { ResizeMode, Video } from 'expo-av';
import Toast from 'react-native-toast-message';
import { summarizeText } from '../../../functions';
import { auth, limits, useData } from '../../../hooks';
import { Dimensions, FlatList, Platform } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon, Loader, ListItemWithIcon, Back } from '../../../components';
import { View, Text, Colors, TouchableOpacity, Hint, Switch, TextField } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const { pTextLen } = limits;

const publichint = 'Post shared here will be visible to this tribe members, people who visit your profile and in connections page';
const privatehint = 'Post shared here will be only visible to tribe members';

let mediaType = null;

export default function CreatePost(){

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, Public, category } = route.params;

    const { profile } = useData();

    const enableSpoiler = React.useMemo(() => category==='Movies');

    const [loading, setLoading] = React.useState(false);
    const [openHint, setOpenHint] = React.useState(false);

    const [isValid, setIsValid] = React.useState({
        text: false,
        img: false,
        video: false,
    });

    const [data, setData] = React.useState({
        text: '',
        img: false,
        video: false,
        Public: Public,
        spoiler: false,
        mediaHeight: width*0.9
    });

    const canContinue = React.useMemo(() => Object.values(isValid).includes(true));

    const handleChange = React.useCallback((value) => {
        setData(state => ({ ...state, ...value }));
    }, [setData]);

    const handleHinte = React.useCallback(() => {
        setOpenHint(state => !state);
    }, [setOpenHint]);

    const Paraphrase = async(text) => {
        const arr = [];
        if(text?.trim()?.length===0){
            Toast.show({ text1: 'Please enter a sentence to Rephrase' });
            return;
        }
        Toast.show({ 
            props: { type: 'bot', text: '' },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
        arr.push({
            role: 'user',
            content: `Paraphrase this: ${text}`
        });
        const returnText = await summarizeText(arr);
        setTimeout(() => {
            setData(state => ({
                ...state,
                text: state.text.replace(text, returnText)
            }));
        }, 100);
        Toast.hide();
    };

    const fetchImage = () => {
        mediaType = 'photo';
        navigation.navigate('ImagePicker', { ...route.params, from: 'CreatePost', type: 'photo' });
    };

    const fetchVideo = () => {
        mediaType = 'video';
        navigation.navigate('ImagePicker', { ...route.params, from: 'CreatePost', type: 'video' });
    };

    const next = async(content) => {
        setLoading(state => !state);
        const ref = await createPost(roomId, profile?.verified, Public, content).catch(() => {
            setLoading(state => !state);
            Toast.show({ text1: "Couldn't process your request" });
            return;
        });
        if(ref===null){ 
            setLoading(state => !state);
            return;
        }
        Toast.show({ text1: "Posted 🎉 Refresh to view" });
        navigation.goBack();
    };

    const post = async() => {
        setData(content => {
            next(content);
            return content;
        });
    };

    React.useEffect(() => {
        const fileURL = route.params?.fileURL;
        const mediaHeight = route.params?.mediaHeight;
        if(!fileURL) return;
        if(mediaType==='photo') handleChange({ img: fileURL, mediaHeight: mediaHeight });
        else if(mediaType==='video') handleChange({ video: fileURL, mediaHeight: mediaHeight });
    }, [route.params]);

    React.useEffect(() => {
        setIsValid(state => ({
            ...state,
            text: data.text.length!==0,
            img: data.img!==false,
            video: data.video!==false,
        }));
    }, [data, setIsValid]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            cardStyleInterpolator: isAndroid?CardStyleInterpolators.forBottomSheetAndroid:CardStyleInterpolators.forModalPresentationIOS,
            headerTitle: () => (
                <Hint 
                onBackgroundPress={handleHinte}
                position='BOTTOM'
                visible={openHint} 
                message={Public?publichint:privatehint} color={Colors.bg2} 
                messageStyle={{ color: Colors.textC2 }} 
                offset={10}>
                    <TouchableOpacity padding-6 onPress={handleHinte}>
                        <View row centerV>
                            <Icon name={Public?'public':'lock'} color={Colors.textC2} size={16}/>
                            <Text textC2 text90R marginR-8> • {Public?'Public':'Private'} post</Text>
                            <Icon name='question' type='octicons' color={Colors.textC2} size={14}/>
                        </View>
                    </TouchableOpacity>
                </Hint>
            ),
            headerLeft: () => <Back close/>,
            headerRight: () => (
                <View marginR-22>
                    {loading?
                    <Loader size={30}/>:
                    <TouchableOpacity onPress={() => {
                        if(canContinue) post();
                    }}>
                        <Icon name='ios-send' type='ion' color={canContinue?Colors.primary:Colors.textC2}/>
                    </TouchableOpacity>}
                </View>
            ),
        });
    }, [navigation, openHint, Public, loading, canContinue]);

    const media = React.useMemo(() => (
        <View row centerV spread width={width} paddingH-16>
            <View row centerV>
                {data.video?null: 
                <View marginR-16>
                    {data.img?null:
                    <TouchableOpacity onPress={fetchImage}>
                        <View padding-6 br60 bg-primary>
                            <Icon name='image'/>
                        </View>
                    </TouchableOpacity> }
                </View> }
                {data.img?null:
                <View marginR-16>
                    {data.video?null:
                    <TouchableOpacity onPress={fetchVideo}>
                        <View padding-6 br60 bg-primary>
                            <Icon name='video-vintage' type='material-community'/>
                        </View>
                    </TouchableOpacity>}
                </View>}
                <TouchableOpacity onPress={() => Paraphrase(data.text)}>
                    <View padding-6 br60 bg-primary>
                        <Icon name='dependabot' type='octicons'/>
                    </View>
                </TouchableOpacity>
            </View>
            <Text textC2 text70R>{data.text.length}/{pTextLen}</Text>
        </View>
    ));

    const overlay = React.useMemo(() => (
        <View absH absV right width={width*0.9}>
            <TouchableOpacity marginT-10 onPress={() => handleChange({ img: false, video: false })}>
                <View br60 center bg-bg2 width={40} height={40}>
                    <Icon name='close'/>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const imgview = React.useMemo(() => (
        <View centerH width={width}>
            <Image 
            contentFit='cover' 
            recyclingKey={data.img}
            source={{ uri: data.img }} 
            style={{ width: width*0.9, height: data.mediaHeight, borderRadius: 15, backgroundColor: Colors.bg2 }}/>
            {overlay}
        </View>
    ));

    const vidview = React.useMemo(() => (
        <View centerH width={width}>
            <View br50 bg-bg2 overflow='hidden'>
                <Video 
                shouldPlay 
                isMuted 
                isLooping 
                source={{ uri: data.video }}
                resizeMode={ResizeMode.COVER}
                style={{ width: width*0.9, height: data.mediaHeight, borderRadius: 15 }}/>
            </View>
            {overlay}
        </View>
    ));

    const header = React.useMemo(() => (
        <View flex>
            <View row top padding-16 width={width}>
                <Image 
                placeholderContentFit='contain' 
                placeholder='https://shorturl.at/PQTW4' 
                recyclingKey={auth.currentUser.photoURL} 
                source={{ uri: auth.currentUser.photoURL }} 
                style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bg2 }}/>
                <TextField
                margin-16
                multiline 
                textC1 text70R 
                value={data.text} 
                maxLength={pTextLen} 
                style={{ width: width*0.75 }} 
                placeholderTextColor={Colors.textC2} 
                placeholder='Share your knowledge...' 
                onChangeText={e => handleChange({ text: e })}/>
            </View>
            {media}
            {enableSpoiler?
            <ListItemWithIcon 
            title='Spoiler Alert'
            subtitle='Alert users about the spoiler ahead'
            icon='alert-circle'
            type='ion' disablePress
            color={Colors.primary}
            right={<Switch onColor={Colors.primary} value={data.spoiler} onValueChange={e => handleChange({ spoiler: e })}/>}/>:null}
            <View marginT-16>
                {data.video?null:data.img?imgview:null}
                {data.img?null:data.video?vidview:null}
            </View>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            <FlatList
            style={{ flex: 1 }}
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={300}/>}/>
        </View>

    );

};