import React from 'react';
import Hyperlink from 'react-native-hyperlink';
import ReadMore from 'react-native-read-more-text';
import { copyText, openLink } from '../../functions';
import { Pressable, StyleSheet } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';

const TextView = ({msg, fromDm, me, l, isOnlyEmoji}) => {

    const font = React.useMemo(() => ({ 
        text70: !isOnlyEmoji, 
        text20: isOnlyEmoji 
    }));

    const message = React.useMemo(() => msg?.trim());

    const styles = StyleSheet.create({
        container: {
            padding: l?15:0
        },
        link: {
            color: fromDm?Colors.textC1:Colors.primary, 
            textDecorationLine: fromDm?'underline':'none' 
        },
        rm: {
            color: (fromDm&&me)?Colors.white:Colors.primary,
        }
    });

    const Footer = ({label, handlePress}) => (
        <Pressable onPress={handlePress}>
            <Text text80R style={styles.rm}>{label}</Text>
        </Pressable>
    );

    return (

        <View style={styles.container}>
            <Hyperlink linkStyle={styles.link} onPress={(url) => openLink(url)} onLongPress={(url) => copyText(url)}>
                <ReadMore 
                numberOfLines={10} 
                renderRevealedFooter={(handlePress) => <Footer label='less' handlePress={handlePress}/>}
                renderTruncatedFooter={(handlePress) => <Footer label='more' handlePress={handlePress}/>}>
                    <Text textC1 {...font}>{message}</Text>
                </ReadMore>
            </Hyperlink>
        </View>

    );

};

export default React.memo(TextView);