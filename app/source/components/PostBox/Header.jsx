import React from 'react';
import Icon from '../Icon';
import Menu from '../Menu';
import { Image } from 'expo-image';
import { auth } from '../../hooks';
import { Pressable } from 'react-native';
import { timeAgo } from '../../functions';
import { View, Text, Colors } from 'react-native-ui-lib';

const MoreFunc = (id, byme, url, Public) => {
    if(byme){
        const { delPost } = require('../../screens/tribe/post/helper');
        const { show } = require('react-native-toast-message').default;
        delPost(id, url, Public);
        show({ text1: 'Your post was deleted' });
    }else{
        const { reportFunc } = require('../../functions');
        reportFunc(`/post/${id}`);
    }
};

const copyLink = (id) => {
    const { copyText } = require('../../functions');
    copyText(`https://wytty.org/post/${id}`);
};

const Header = ({id, dp, verified, name, by, url, Public, timestamp, onDpPress}) => {

    const TimeStamp = React.useMemo(() => timeAgo(timestamp));
    const byme = React.useMemo(() => by===auth.currentUser.uid);

    const dot = React.useMemo(() => (
        <Menu 
        options={[
            {
                text: 'Copy link',
                icon: 'link',
                type: 'ion',
                onPress: () => copyLink(id),
            },
            {
                text: byme?'Delete':'Report',
                color: Colors.red,
                icon: byme?'trash-2':'flag',
                type: 'feather',
                onPress: () => MoreFunc(id, byme, url, Public)
            }
        ]}
        children={
            <View centerV height={60}>
                <Icon name='more-horiz' color={Colors.icon}/>
            </View>
        }/>
    ));

    return (

        <View row centerV spread paddingH-12 width='100%' height={66}>
            <Pressable onPress={onDpPress}>
                <View row centerV>
                    <View>
                        <Image recyclingKey={dp} source={{ uri: dp }} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.line }}/>
                        {verified?
                        <View absB absR marginL-6>
                            <Icon name='verified' size={16}/>
                        </View>:null}
                    </View>
                    <View marginL-16>
                        <Text textC1 text70M numberOfLines={1}>{name}</Text>
                        <View row centerV marginT-2>
                            <Icon name={Public?'public':'lock'} color={Colors.textC2} size={12}/>
                            <Text text90R textC2> • {TimeStamp}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
            {dot}
        </View>

    );

};

export default React.memo(Header);