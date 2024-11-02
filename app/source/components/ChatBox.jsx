import React from 'react';
import Icon from './Icon';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { getDp, timeAgo } from '../functions';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const ChatBox = ({ roomId, recipientId, name, notification, myNotification, lastmessage, lastmessageby, seen, timestamp = new Date(), element, search }) => {

    const navigation = useNavigation();

    const [dp, setDp] = React.useState('https://shorturl.at/PQTW4');

    const lastMsgByMe = React.useMemo(() => lastmessageby===auth.currentUser.uid);
    const seencolor = React.useMemo(() => (!seen&&!lastMsgByMe)?Colors.textC1:Colors.textC2);

    const font = React.useMemo(() => ({ 
        text80R: !(!seen&&!lastMsgByMe), 
        text80BO: (!seen&&!lastMsgByMe), 
    }));

    const onPress = () => {
        navigation.navigate('MessageScreen', {
            roomId: roomId,
            recipientId: recipientId,
            recipientUserName: name,
            recipientDp: dp,
            notification: notification,
            myNotification: myNotification,
        });
    };

    const onLongPress = () => {
        navigation.navigate('OthersProfile', { 
            id: recipientId, 
            username: name 
        });
    };

    const ESelector = () => {
        switch(element){
            case 'text':
                return <Text color={seencolor} numberOfLines={1} {...font}>{lastmessage}</Text>;
            case 'sticker':
                return <Icon size={18} name="sticker-circle-outline" type='material-community' color={seencolor}/>;
            case 'image':
                return <Icon name="image" size={18} color={seencolor}/>;
            case 'new':
                return (
                    <View row centerV>
                        <Icon name="burst-new" type='foundation' size={18}/>
                        <Text marginL-6 text80BO white>New Connection</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    const fetchDp = async() => {
        const uri = await getDp(recipientId);
        setDp(uri);
    };

    React.useEffect(() => {
        fetchDp();
    }, [recipientId]);

    return (

        <TouchableOpacity row centerV onPress={onPress} onLongPress={onLongPress}>

            <View width={width*0.2} height={76} center>
                <Image
                recyclingKey={dp}
                source={{ uri: dp }}
                placeholderContentFit='contain'
                placeholder='https://shorturl.at/PQTW4'
                style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.bg2 }}/>
            </View>

            <View height={76} centerV width={width*0.65}>
                <View row centerV marginL-4>
                    <Text textC1 text70M numberOfLines={1} marginR-6>{name}</Text>
                    { myNotification ? null : <Icon name="volume-x" type='feather' size={14} color={Colors.textC2}/> }
                </View>
                {search?null:
                <View row centerV width={width*0.5} marginL-4>
                    <Text text80R color={seencolor}>{lastMsgByMe?'You: ':null}</Text>
                    <ESelector/>
                    <Text marginR-6 color={seencolor} {...font}>{' • '}{timeAgo(timestamp)}</Text>
                    { lastMsgByMe ? null : <View width={8} height={8} br100 backgroundColor={seen?null:Colors.textC1} marginH-6/>}
                </View>}
            </View>

            <View height={76} center width={width*0.15}>
                { lastMsgByMe ? <Icon name={seen?'check-circle':'radio-button-unchecked'} color={Colors.textC2} size={14}/> : null }
            </View>

        </TouchableOpacity>

    );

};

export default React.memo(ChatBox);