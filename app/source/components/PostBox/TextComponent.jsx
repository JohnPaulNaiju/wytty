import React from 'react';
import Hyperlink from 'react-native-hyperlink';
import ReadMore from 'react-native-read-more-text';
import { Text, Colors } from 'react-native-ui-lib';
import { copyText, openLink } from '../../functions';
import { StyleSheet, Pressable } from 'react-native';

const Footer = ({handlePress, type}) => {

    return (

        <Pressable onPress={handlePress}>
            <Text text70R primary>{type}</Text>
        </Pressable>

    );

};

const TextComponent = ({text}) => {

    if(text)

    return (

        <Hyperlink 
        style={styles.container}
        onPress={(url) => openLink(url)}
        onLongPress={(url) => copyText(url)}
        linkStyle={{ color: Colors.primary }}>
            <ReadMore numberOfLines={5}
            renderTruncatedFooter={(handlePress) => <Footer handlePress={handlePress} type='more'/>}
            renderRevealedFooter={(handlePress) => <Footer handlePress={handlePress} type='less'/>}>
                <Text text70R textC1>{text}</Text>
            </ReadMore>
        </Hyperlink>

    );

};

const styles = StyleSheet.create({
    container: {
        marginTop: 6,
        width: '100%',
        paddingHorizontal: 18,
    }
});

export default React.memo(TextComponent);