import React from 'react';
import { Image } from 'expo-image';
import { openLink } from '../../functions';
import { View, Text } from 'react-native-ui-lib';
import { Dimensions, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

const LinkView = ({li, l, lt}) => {

    return (

        <Pressable onPress={() => openLink(l)}>
            <View width={width*0.7}>
                <Image source={{ uri: li }} recyclingKey={li} style={{ width: width*0.7, height: 150, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>
                <View paddingH-16 marginT-6>
                    <Text textC1 text70M numberOfLines={1}>{lt}</Text>
                    <Text textC2 text90R numberOfLines={1}>{l}</Text>
                </View>
            </View>
        </Pressable>

    );

};

export default React.memo(LinkView);