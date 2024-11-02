import React from 'react';
import Video from '../Video';
import Header from './Header';
import Footer from './Footer';
import ImageView from '../ImageView';
import { Dimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import TextComponent from './TextComponent';

const { width } = Dimensions.get('window');

const SpolierView = () => {

    const SubView = require('../Blur').default;
    return <SubView element='spoiler'/>;

};

const PostBox = ({ 
    id, 
    by, 
    name, 
    dp, 
    text, 
    imageUrl, 
    vidUrl, 
    scontent, 
    comments, 
    lastComment, 
    liked, 
    likes, 
    timestamp, 
    Public, 
    verified, 
    spoiler, 
    mediaHeight,
    onDpPress, 
    onCommentPress, 
    onTribePress, 
    hide,
    incLike, 
    incComment, 
}) => {

    const mH = React.useMemo(() => mediaHeight?mediaHeight>width?width:mediaHeight:width);

    return (

        <View centerH width={width}>
            <Header 
            id={id} 
            dp={dp} 
            by={by} 
            name={name} 
            Public={Public} 
            verified={verified} 
            timestamp={timestamp} 
            onDpPress={onDpPress}
            url={imageUrl || vidUrl}/>
            {imageUrl?
            <ImageView 
            post 
            h={mH} 
            w={width*0.93} 
            uri={imageUrl} 
            scontent={scontent}/>:null}
            {vidUrl?
            <Video 
            url={vidUrl} 
            vidHeight={mH} 
            width={width*0.93}
            scontent={scontent}/>:null}
            {text?<TextComponent text={text}/>:null}
            {hide?null:
            <Footer 
            id={id} 
            by={by} 
            name={name} 
            text={text} 
            liked={liked} 
            likes={likes} 
            vidUrl={vidUrl} 
            imgUrl={imageUrl} 
            incLike={incLike} 
            comments={comments} 
            incComment={incComment} 
            lastComment={lastComment} 
            onTribePress={onTribePress} 
            onCommentPress={onCommentPress}/>}
            {spoiler?<SpolierView/>:null}
        </View>

    );

};

export default React.memo(PostBox);