import React from 'react';
import Toast from 'react-native-toast-message';
import { SaveMessage, linkUpdate } from './helper';
import { useAnimation, auth, limits } from '../../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinkPreview, fetchStickers, uploadFile } from '../../functions';
import { Icon, ReplyContainer, StickerContainer, Menu } from '../../components';
import { View, Colors, TextField, TouchableOpacity } from 'react-native-ui-lib';
import { Dimensions, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const { textLen } = limits;

let stickerOpen = true;

const Footer = ({roomId, cancel, rstyle, reply, username, newmsg}) => {

    const navigation = useNavigation();
    const route = useRoute();

    const [array1, setArray1] = React.useState('_');
    const { StickerStyle, hideSticker, showSticker } = useAnimation();

    const inpRef = React.useRef(null);
    const textRef = React.useRef('');

    const send = async(element, url, mediaHeight) => {
        newmsg.current++;
        if(reply.reply) cancel();
        if(element==='text'){
            const msg = textRef.current?.trim();
            if(msg.length===0) return;
            inpRef.current?.clear();
            const ref = await SaveMessage(roomId, msg, element, null, reply, null, null);
            if(!ref) return;
            const link = await LinkPreview(msg);
            if(link) linkUpdate(roomId, ref, link.uri, link.title, link.image);
        }else if(element==='sticker'||element==='image') await SaveMessage(roomId, null, element, url, reply, null, mediaHeight);
    };

    const getImage = () => {
        navigation.navigate('ImagePicker', { ...route.params, from: 'MessageScreen', type: 'photo' });
    };

    const uploadImage = async(uri, mediaHeight) => {
        const imgId = Date.now()+Math.random().toString(36)?.substring(2, 15);
        const path = `messaging/${roomId}/${auth.currentUser.uid}/${imgId}_img.webp`;
        Toast.show({ 
            props: {
                type: 'image',
                uri: uri, 
            },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
        const url =  await uploadFile(uri, path, 'image/webp');
        if(url){
            send('image', url, mediaHeight);
            Toast.hide();
            return;
        }
        Toast.show({ text1: 'Image size is too big. Max size is 5 MB' });
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
        stickers={array1} 
        hide={hideSticker} 
        style={StickerStyle}
        send={e => send('sticker', e, null)}/>
    ));

    const ReplyView = React.useMemo(() => (
        <ReplyContainer 
        fromDm 
        cancel={cancel} 
        name={username} 
        style={rstyle} 
        reply={reply}/>
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
            onPress: () => navigation.navigate('SendNote', { roomId: roomId, reply: reply, text: textRef.current, from: 'chat' }),
        },
        {
            text: 'Share a file',
            icon: 'file-text',
            type: 'feather',
            onPress: () => navigation.navigate('SendFile', { roomId: roomId, reply: reply, text: textRef.current, from: 'chat' }),
        },
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

            <TouchableOpacity onPress={() => send('text', null, null)}>
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

        <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={105}>
            {reply.reply?ReplyView:null}
            <View center marginV-8 bg-bg1 width={width} maxHeight={120} minHeight={55}>
                {TextArea}
            </View>
            {Sticker}
        </KeyboardAvoidingView>

   );

};

export default React.memo(Footer);