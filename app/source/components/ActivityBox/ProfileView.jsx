import React from 'react';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors } from 'react-native-ui-lib';

const ProfileView = ({params, dp, msg, width, open}) => {

    const navigation = useNavigation();

    const nav = () => {
        navigation.navigate('OthersProfile', {...params});
    };

    return (

        <Pressable onPress={nav} onLongPress={open}>
            <View top row centerV spread paddingR-16 width={width}>
                <View width={width-62}>
                    <Text text70R textC1>{msg}</Text>
                </View>
                <View center height={40} width={40}>
                    <Image source={{ uri: dp }} recyclingKey={dp} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg2 }}/>
                </View>
            </View>
        </Pressable>

    );

};

export default React.memo(ProfileView);