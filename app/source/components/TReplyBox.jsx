import React from 'react';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { stringToColor } from '../functions';
import { View, Text } from 'react-native-ui-lib';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const TReplyBox = ({ me, to, replier, msg, e }) => {

    const borderColor = React.useMemo(() => stringToColor(to?to:''));
    const text = React.useMemo(() => `${me?'You':replier} mentioned ${to===auth.currentUser.displayName?me?'yourself':'you':to}`);

    const styles = StyleSheet.create({
        reply: {
            padding: 6,
            maxWidth: width*0.7,
            opacity: 0.8,
            borderRadius: 5,
            borderRightWidth: me?4:0,
            borderRightColor: me?borderColor:null,
            borderLeftWidth: me?0:4,
            borderLeftColor: me?null:borderColor,
            marginLeft: me?0:6,
            marginTop: 4,
        },
    });

    const ESelector = () => {
        switch(e){
            case 'text':
                return <Text text70R textC2 numberOfLines={2}>{msg}</Text>;
            case 'sticker':
                return <Image contentFit='contain' source={{ uri: msg }} recyclingKey={msg} style={{ width: 60, height: 60, borderRadius: 10 }} placeholder='https://wytty.org/placeholder.png'/>;
            case 'image':
                return <Image contentFit='contain' source={{ uri: msg }} recyclingKey={msg} style={{ width: 80, height: 80, borderRadius: 10 }} placeholder='https://wytty.org/placeholder.png'/>;
            default:
                return null;
        }
    };

    return (

        <View style={styles.reply}>
            <Text color={borderColor} text70R>{text}</Text>
            <ESelector/>
        </View>

    );

};

export default React.memo(TReplyBox);