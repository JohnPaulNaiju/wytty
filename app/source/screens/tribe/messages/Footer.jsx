import React from 'react';
import Toast from 'react-native-toast-message';
import { SaveMessage, linkUpdate } from './helper';
import { useAnimation, auth, limits } from '../../../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinkPreview, fetchStickers, uploadFile } from '../../../functions';
import { View, TouchableOpacity, TextField, Colors } from 'react-native-ui-lib';
import { Icon, Menu, ReplyContainer, StickerContainer } from '../../../components';
import { Dimensions, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const { textLen } = limits;

let stickerOpen = true;

const Footer = ({roomId, reply, cancel, rstyle, summarize, category}) => {

    const navigation = useNavigation();
    const route = useRoute();

    const { StickerStyle, showSticker, hideSticker } = useAnimation();

    const inpRef = React.useRef(null);
    const textRef = React.useRef('');

    const [array1, setArray1] = React.useState('_');

    const isDev = React.useMemo(() => category==='Developers');

    const send = async(element, url, code, mediaHeight) => {
        if(reply.reply) cancel();
        if(element==='text'){
            const msg = textRef.current?.trim();
            if(msg.length===0) return;
            inpRef.current?.clear();
            const ref = await SaveMessage(roomId, msg, element, null, reply, null, code, null);
            if(!ref) return;
            const link = await LinkPreview(msg);
            if(link) linkUpdate(roomId, ref, link.uri, link.title, link.image); 
        }else if(element==='sticker'||element==='image'||element==='video'){
            await SaveMessage(roomId, null, element, url, reply, null, null, mediaHeight);
        }
    };

    const getImage = () => {
        navigation.navigate('ImagePicker', { ...route.params, from: 'Tribe', type: 'photo' });
    };

    const uploadImage = async(uri, mediaHeight) => {
        const imgId = Date.now()+Math.random().toString(36)?.substring(2, 15);
        const path = `tribes/${roomId}/messages/${auth.currentUser.uid}/${imgId}_img.webp`;
        Toast.show({ 
            props: {
                type: 'image',
                uri: uri
            },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
        const url = await uploadFile(uri, path, 'image/webp');
        if(url){
            send('image', url, null, mediaHeight);
            Toast.hide();
            return;
        }
        Toast.show({ text1: 'File size is too big. Max size is 5 MB' });
    };

    const getSticker = React.useCallback(async() => {
        stickerOpen = !stickerOpen;
        if(stickerOpen){
            hideSticker();
            return;
        }
        Keyboard.dismiss();
        showSticker();
        const stickerJSON = await fetchStickers(textRef.current);
        inpRef.current?.clear();
        setArray1(stickerJSON);
    }, [setArray1]);

    React.useEffect(() => {
        const fileURL = route.params?.fileURL;
        const mediaHeight = route.params?.mediaHeight;
        if(fileURL) uploadImage(fileURL, mediaHeight);
    }, [route.params]);

    React.useEffect(() => {
        Keyboard.addListener(isAndroid?'keyboardDidShow':'keyboardWillShow', () => {
            hideSticker();
        });
        return () => {
            Keyboard.addListener(isAndroid?'keyboardDidShow':'keyboardWillShow', () => {
                hideSticker();
            }).remove();
        }
    }, [navigation]);

    const Sticker = React.useMemo(() => (
        <StickerContainer 
        style={StickerStyle} 
        stickers={array1} 
        hide={hideSticker} 
        send={e => send('sticker', e, null, null)}/>
    ));

    const ReplyView = React.useMemo(() => (
        <ReplyContainer 
        style={rstyle} 
        reply={reply} 
        cancel={cancel}/>
    ));

    const children = React.useMemo(() => (
        <View center height={55} width={45}>
            <Icon 
            size={28} 
            name="add"
            color={Colors.textC1}/>
        </View>
    ));

    const options = React.useMemo(() => [
        {
            text: 'Share an image',
            icon: 'image',
            type: 'feather',
            onPress: () => getImage(),
        },
        {
            text: 'Share a note',
            icon: 'notebook',
            type: 'material-community',
            onPress: () => navigation.navigate('SendNote', { roomId: roomId, reply: reply, text: textRef.current, from: 'tribe' }),
        },
        {
            text: 'Share a file',
            icon: 'file-text',
            type: 'feather',
            onPress: () => navigation.navigate('SendFile', { roomId: roomId, reply: reply, text: textRef.current, from: 'tribe' }),
        },
        {
            text: 'Create a poll',
            icon: 'ballot',
            onPress: () => navigation.navigate('CreatePoll', { roomId: roomId }),
        },
        isDev&&{
            text: 'Send as code',
            icon: 'microsoft-visual-studio-code',
            type: 'material-community',
            color: Colors.primary,
            onPress: () => send('text', null, true, null),
        },
        {
            text: 'AI Summarize',
            icon: 'android-messages',
            type: 'material-community',
            color: Colors.green,
            onPress: () => summarize(),
        }
    ]);

    const TextArea = React.useMemo(() => (
        <View width={width*0.95} minHeight={55} maxHeight={120} row spread bg-bg2 br60 paddingR-12 bottom>

            <TouchableOpacity onPress={getSticker}>
                <View center height={55} width={45}>
                    <Icon 
                    size={26} 
                    color={Colors.textC1} 
                    type='material-community' 
                    name="sticker-circle-outline"/>
                </View>
            </TouchableOpacity>

            <View minHeight={55} centerV flex>
                <TextField 
                textC2 
                text70R 
                marginV-6
                multiline 
                ref={inpRef} 
                maxLength={textLen} 
                placeholder='Message...' 
                placeholderTextColor={Colors.textC2} 
                onChangeText={e => textRef.current=e}/>
            </View>

            <Menu options={options} children={children}/>

            <TouchableOpacity onPress={() => send('text', null, null, null)}>
                <View center height={55} width={45}>
                    <Icon 
                    name="paper-plane"
                    type='font-awesome'
                    color={Colors.textC1}/>
                </View>
            </TouchableOpacity>

        </View>
    ));

    return (

        <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={160}>
            {reply?.reply?ReplyView:null}
            <View center bg-bg1 marginV-8 width={width} maxHeight={120} minHeight={55}>
                {TextArea}
            </View>
            {Sticker}
        </KeyboardAvoidingView>

    );

};

export default React.memo(Footer);