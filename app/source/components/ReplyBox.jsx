import React from 'react';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const ReplyBox = ({relement, replymsg, me, replyingto, username}) => {

    const color = React.useMemo(() => relement==='text'?Colors.bg2:null);
    const text = React.useMemo(() => `${me?'You':username} replying to ${replyingto===auth.currentUser.uid?me?'yourself':'you':username}`);

    const styles = StyleSheet.create({
        reply: {
            borderLeftWidth: me?0:4, 
            borderRightWidth: me?4:0, 
            borderLeftColor: me?null:Colors.border, 
            borderRightColor: me?Colors.textC2:null, 
            opacity: 0.8,
            padding: 8,
            marginTop: 4,
            maxWidth: width*0.7,
            backgroundColor: color,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: me?5:0,
            borderBottomRightRadius: me?0:5,
        }
    });

    const ESelector = () => {
        switch(relement){
            case 'text':
                return <Text textC2 text70R marginT-4 numberOfLines={2}>{replymsg}</Text>;
            case 'sticker':
                return <Image contentFit='contain' source={{ uri: replymsg }} recyclingKey={replymsg} style={{ width: 60, height: 60 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>;
            case 'image':
                return <Image contentFit='contain' source={{ uri: replymsg }} recyclingKey={replymsg} style={{ width: 80, height: 80, backgroundColor: Colors.bg2, borderRadius: 8 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>;
            default:
                return null;
        };
    };

    return (

        <View style={styles.reply}>
            <Text textC2 text70R>{text}</Text>
            <ESelector/>
        </View>
    );

};

export default React.memo(ReplyBox);