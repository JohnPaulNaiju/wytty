import React from 'react';
import { auth } from '../hooks';
import NoteBox from './NoteBox';
import FileBox from './FileBox';
import { Image } from 'expo-image';
import ImageView from './ImageView';
import { regex } from '../functions';
import LinkText from './LinkText/index';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const End = (index, sMsgBy, by) => {
    if(index!==0){
        if(sMsgBy===by) return false;
        return true;
    } return true;
};

const Start = (index, msgLength, pMsgBy, by) => {
    if(index!==msgLength-1){
        if(pMsgBy===by) return false;
        return true;
    } return true;
};

const ShowTime = (index, sMsgBy, by) => {
    if(index!==0){
        if(sMsgBy===by) return false;
        return true;
    } return true;
};

const Footer1 = ({timestamp, dp}) => {

    const { timeAgo } = require('../functions');

    const theTime = React.useMemo(() => timeAgo(timestamp));

    return (

        <View row centerV paddingR-20 paddingT-6 marginLeft={-26}>
            <Image 
            recyclingKey={dp} 
            source={{ uri: dp }} 
            placeholderContentFit='contain' 
            placeholder='https://shorturl.at/PQTW4' 
            style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg2 }}/>
            <Text textC2 text80R marginL-8>{theTime}</Text>
        </View>

    );

};

const Footer2 = ({timestamp, seen}) => {

    const Icon = require('./Icon').default; 
    const { timeAgo } = require('../functions');

    const theTime = React.useMemo(() => timeAgo(timestamp));

    return (

        <View row centerV paddingR-8 paddingT-6>
            <Text textC2 text80R>{theTime+' • '}</Text>
            <Icon name='done-all' size={18} color={seen?Colors.primary:Colors.textC2}/>
        </View>

    );

};

const ReplyView = ({ByMe, relement, replyingto, replymsg, username}) => {

    const ReplyBox = require('./ReplyBox').default;

    return (

        <ReplyBox 
        me={ByMe} 
        relement={relement} 
        replyingto={replyingto} 
        replymsg={replymsg} 
        username={username}/>

    );

};

const Message = ({index, msgLength, sMsgBy, pMsgBy, username, dp, link, ltitle, limg, by, timestamp = new Date(), seen, element, message, imageUrl, reply, replymsg, replyingto, relement, noteId, title, filename, size, fileUrl, mime, mediaHeight}) => {

    const ByMe = React.useMemo(() => by===auth.currentUser.uid);
    const start = React.useMemo(() => Start(index, msgLength, pMsgBy, by));
    const end = React.useMemo(() => End(index, sMsgBy, by));
    const show = React.useMemo(() => ShowTime(index, sMsgBy, by));

    const isOnlyEmoji = React.useMemo(() => regex.emojiRegex.test(message));
    const isText = React.useMemo(() => element==='text'?isOnlyEmoji?false:true:false);
    const color = React.useMemo(() => isText?ByMe?Colors.chat:Colors.bg2:null);

    const align = React.useMemo(() => ({ 
        left: !ByMe, 
        right: ByMe, 
        marginTop: start?10:2, 
        [`paddingR-8`]: true, 
        [`paddingL-36`]: true 
    }));

    const styles = StyleSheet.create({
        msg: {
            paddingHorizontal: link?0:isText?14:0,
            paddingVertical: link?0:isText?8:0,
            backgroundColor: link?Colors.bg2:color,
            maxWidth: width*0.7,
            borderTopRightRadius: ByMe?start?reply?0:20:0:20,
            borderTopLeftRadius: !ByMe?start?reply?0:20:0:20,
            borderBottomRightRadius: ByMe?end?20:0:20,
            borderBottomLeftRadius: !ByMe?end?20:0:20,
        }
    });

    const ESelector = () => {
        switch(element){
            case 'text':
                return <LinkText fromDm={true} l={link} li={limg} lt={ltitle} me={ByMe} msg={message}/>;
            case 'sticker':
                return <Image contentFit='contain' source={{ uri: imageUrl }} recyclingKey={imageUrl} style={{ width: 80, height: 80 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain' />;
            case 'image':
                return <ImageView h={mediaHeight} uri={imageUrl} w={width*0.7} chat/>;
            case 'file':
                return <FileBox by={by} category='File' filename={filename} mime={mime} name={username} size={size} timestamp={timestamp} url={fileUrl} msg={message}/>;
            case 'note':
                return <NoteBox by={by} me={ByMe} noteId={noteId} category='Note' title={title} name={username} timestamp={timestamp} msg={message}/>
            default:
                return null;
        }
    };

    return (

        <View width={width} {...align}>
            {reply?<ReplyView ByMe={ByMe} relement={relement} replyingto={replyingto} replymsg={replymsg} username={username}/>:null}
            <View style={styles.msg}>
                <ESelector/>
            </View>
            {show?ByMe?<Footer2 seen={seen} timestamp={timestamp}/>:<Footer1 dp={dp} timestamp={timestamp}/>:null}
        </View>

    );

};

export default React.memo(Message);

// import Day from './Day'; 
// ptime, 
// <Day ptime={ptime} time={timestamp}/>
// ptime={array1[index===0?0:index-1]?.timestamp} 