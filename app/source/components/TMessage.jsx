import React from 'react';
import { auth } from '../hooks';
import PollBox from './PollBox';
import NoteBox from './NoteBox';
import FileBox from './FileBox';
import { Image } from 'expo-image';
import ImageView from './ImageView';
import LinkText from './LinkText/index';
import { Dimensions } from 'react-native';
import { View } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const Start = (noDetails, allDetails, index, msgLength, pmsgby, by) => {
    if(noDetails) return false;
    if(allDetails) return true;
    if(index!==msgLength){
        if(pmsgby!==by) return true;
        return false;
    }
    return true;
};

const DetailsView = ({name, timestamp, by}) => {

    const Details = require('./Details').default;

    return (

        <Details 
        name={name} 
        time={timestamp} 
        by={by}/>

    );

};

const ReplyView = ({relement, ByMe, replymsg, replyingto, replier}) => {

    const TReplyBox = require('./TReplyBox').default;

    return (

        <TReplyBox 
        e={relement} 
        me={ByMe} 
        msg={replymsg} 
        to={replyingto} 
        replier={replier}/>

    );

};

const TMessage = ({noAlign, w, roomId, index, pmsgby, allDetails, noDetails, msgLength, id, by, name, element, message, imageUrl, scontent, timestamp = new Date(), noteId, link, ltitle, limg, reply, relement, replymsg, replyingto, replier, question, option, totalVote, voted, votes, people, category, title, filename, size, fileUrl, mime, fullWidth, code, mediaHeight}) => {

    const ByMe = React.useMemo(() => by===auth.currentUser.uid);
    const start = React.useMemo(() => Start(noDetails, allDetails, index, msgLength, pmsgby, by));

    const align = React.useMemo(() => ({ 
        left: !noAlign&&!ByMe, 
        right: !noAlign&&ByMe, 
        marginTop: start?10:2, 
        [`paddingR-8`]: !noAlign&&true, 
        [`paddingL-34`]: !noAlign&&true, 
        ['marginT-6']: noAlign 
    }));

    const ESelector = () => {
        switch(element){
            case 'text':
                return <LinkText me={ByMe} l={link} li={limg} lt={ltitle} msg={message} noteId={noteId} code={code}/>;
            case 'sticker':
                return <Image contentFit='contain' source={{ uri: imageUrl }} recyclingKey={imageUrl} style={{ width: 80, height: 80 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain' />;
            case 'image':
                return <ImageView h={mediaHeight} scontent={scontent} uri={imageUrl} w={width*0.7} chat/>;
            case 'poll':
                return <PollBox element={element} id={id} option={option} people={people} question={question} roomId={roomId} timestamp={timestamp} totalVote={totalVote} voted={voted} votes={votes}/>;
            case 'note':
                return <NoteBox by={by} me={ByMe} noteId={noteId} category={category} title={title} name={name} timestamp={timestamp} msg={message} fullWidth={fullWidth}/>
            case 'file':
                return <FileBox by={by} category={category} filename={filename} mime={mime} name={name} size={size} timestamp={timestamp} url={fileUrl} msg={message} fullWidth={fullWidth}/>;
            default:
                return null;
        }
    };

    return (

        <View width={w?w:width}>
            {(!ByMe&&start)?<DetailsView by={by} name={name} timestamp={timestamp}/>:null}
            <View width={w?w:width} {...align}>
                {reply?<ReplyView ByMe={ByMe} relement={relement} replier={replier} replyingto={replyingto} replymsg={replymsg}/>:null}
                <ESelector/>
            </View>
        </View>

    );

};

export default React.memo(TMessage);