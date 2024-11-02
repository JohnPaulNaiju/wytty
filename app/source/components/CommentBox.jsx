import React from 'react';
import Icon from './Icon';
import Menu from './Menu';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';
import { timeAgo, openLink, reportFunc, formatNumber, copyText } from '../functions';

const { width } = Dimensions.get('window');

const CommentBox = ({id, by, name, dp, message, timestamp, likes, replies, liked, onPress, onDelete, onReplyPress, onLikePress, viewSubply}) => {

    const menuoptions = React.useMemo(() => [
        {
            icon: by===auth.currentUser.uid?'trash':'flag',
            text: by===auth.currentUser.uid?'Delete':'Report',
            type: 'feather',
            color: Colors.red,
            onPress: () => {
                if(by===auth.currentUser.uid) onDelete(id);
                else reportFunc(`/comment/${id}`);
            },
        }
    ]);

    const header = React.useMemo(() => (
        <View width={width} height={50} row centerV spread paddingH-16>
            <TouchableOpacity onPress={onPress}>
                <View row centerV height={50}>
                    <Image
                    recyclingKey={dp}
                    source={{ uri: dp }}
                    placeholderContentFit='contain'
                    placeholder='https://shorturl.at/PQTW4'
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg2 }}/>
                    <Text text70M textC1 marginL-16>{name}</Text>
                    <Text text70R textC2> • {timeAgo(timestamp)}</Text>
                </View>
            </TouchableOpacity>
            <Menu 
            options={menuoptions}
            children={
                <View padding-6>
                    <Icon name='more-horiz' size={16} color={Colors.icon}/>
                </View>
            }/>
        </View>
    ));

    const body = React.useMemo(() => (
        <View width={width} right paddingH-16>
            <View width={width*0.85} paddingH-16>
                <Hyperlink 
                onPress={(url) => openLink(url)} 
                onLongPress={(url) => copyText(url)}
                linkStyle={{ color: Colors.primary }}>
                    <Text text70R textC1 marginL-6>{message}</Text>
                </Hyperlink>
            </View>
        </View>
    ));

    const footer = React.useMemo(() => (
        <View spread paddingH-16 marginT-16 width={width}>
            <View row centerV marginL-46>
                <TouchableOpacity padding-6 onPress={onLikePress}>
                    <Icon name={liked?'like1':'like2'} type='ant' size={18} color={liked?Colors.primary:Colors.icon}/>
                </TouchableOpacity>
                <TouchableOpacity padding-6 marginL-8 onPress={onReplyPress}>
                    <Icon name='export2' type='ant' size={20} color={Colors.icon}/>
                </TouchableOpacity>
                <View row centerV marginL-16>
                    <Text textC2 text80R>{formatNumber(likes||0)} likes • </Text>
                    <TouchableOpacity onPress={viewSubply}>
                        <Text textC2 text80R>{formatNumber(replies)} subplies</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    ));

    return (

        <View width={width} marginT-16 centerH>
            {header}
            {body}
            {footer}
            <View width={width*0.95} height={1} marginT-16 bg-line/>
        </View>

    );

};

export default React.memo(CommentBox);