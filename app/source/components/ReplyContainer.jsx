import React from 'react';
import Icon from './Icon';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { Text, TouchableOpacity, View, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const ReplyContainer = ({ style, reply, name, cancel, fromDm }) => {

    const ESelector = () => {
        switch(reply?.relement){
            case 'text':
                return <Text text80R textC2 numberOfLines={2}>{reply?.replymsg}</Text>;
            case 'sticker':
                return <Image contentFit='contain' source={{ uri: reply?.replymsg }} recyclingKey={reply?.replymsg} style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: Colors.bg2 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>;
            case 'image':
                return <Image contentFit='contain' source={{ uri: reply?.replymsg }} recyclingKey={reply?.replymsg} style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: Colors.bg2 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>;
            default:
                return null;
        }
    };

    return (

        <View reanimated paddingH-12 style={[{ borderTopWidth: 1, borderTopColor: Colors.bg2, width: width }, style]}>
            <View row spread marginT-12>
                {fromDm?
                <Text text80M color={Colors.textC1}>
                    {reply?.replyingto===auth.currentUser.uid?'mentioning to yourself':`mentioning to ${name}`}
                </Text>:
                <Text text80M textC1>
                    {reply?.replyingto===auth.currentUser.displayName?'mentioning to yourself':`mentioning to ${reply?.replyingto}`}
                </Text>}
                <TouchableOpacity onPress={cancel}>
                    <Icon name='cancel' color={Colors.textC2} size={20}/>
                </TouchableOpacity>
            </View>
            <ESelector/>
        </View>

    );

};

export default React.memo(ReplyContainer);