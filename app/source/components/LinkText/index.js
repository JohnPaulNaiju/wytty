import React from 'react';
import TextView from './TextView';
import LinkView from './LinkView';
import CodeView from '../CodeView';
import { regex } from '../../functions';
import { View, Colors } from 'react-native-ui-lib';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const LinkText = ({me, msg, l, lt, li, fromDm, code, ...rest}) => {

    const isOnlyEmoji = React.useMemo(() => regex.emojiRegex.test(msg));
    const msgbgcolor = React.useMemo(() => fromDm?null:isOnlyEmoji?null:Colors.bg2);

    const styles = StyleSheet.create({
        container: {
            maxWidth: width*0.7,
            paddingHorizontal: fromDm?0:l?0:14,
            paddingVertical: fromDm?0:l?0:8,
            marginLeft: me?0:8,
            backgroundColor: msgbgcolor,
        },
    });

    if(code) return <CodeView width={width*0.85} code={msg}/>;

    return (

        <View br60 style={styles.container} {...rest}>
            {l?<LinkView l={l} li={li} lt={lt}/>:null}
            <TextView fromDm={fromDm} isOnlyEmoji={isOnlyEmoji} l={l} me={me} msg={msg}/>
        </View>

    );

};

export default React.memo(LinkText);