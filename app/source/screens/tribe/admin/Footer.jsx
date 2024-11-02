import React from 'react';
import { saveAdminMsg } from './helper';
import { Icon } from '../../../components';
import Toast from 'react-native-toast-message';
import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { View, TextField, Colors, TouchableOpacity, Text } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

const Footer = ({admin, roomId}) => {

    const inputRef = React.useRef(null);
    const messageRef = React.useRef('');

    const sendmsg = () => {
        const msg = messageRef.current?.trim();
        if(msg.length===0) return;
        inputRef.current?.clear();
        saveAdminMsg(roomId, msg, 'text').catch(() => {
            Toast.show({ text1: "Couldn't process your request" });
        });
    };

    const TextArea = React.useMemo(() => (
        <View minHeight={40} maxHeight={120} width={width} bg-bg1 spread row marginV-16 center>
            <View row width={width*0.95} minHeight={40} maxHeight={120} br50 paddingV-6 paddingH-16 bg-bg2 centerV>
                <TextField
                ref={inputRef} 
                onChangeText={ e =>  messageRef.current = e}
                text70R textC2 width={width*0.7} 
                placeholder='Type your message...' marginH-16 marginV-6
                placeholderTextColor={Colors.textC2}
                multiline maxLength={500}/>
                <TouchableOpacity onPress={sendmsg}>
                    <View width={40} height={40} borderRadius={20} center>
                        <Icon name='paper-plane' type='font-awesome'/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    ));

    if(admin){
        return (
            <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={150}>
                <View width={width} maxHeight={120} minHeight={50} centerV marginV-8 bg-bg1>
                    {TextArea}
                </View>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View width={width} height={60} center style={{ borderTopWidth: 2, borderTopColor: Colors.line }}>
            <Text text70R textC2>Only admins can broadcast messages</Text>
        </View>
    );

};

export default React.memo(Footer);