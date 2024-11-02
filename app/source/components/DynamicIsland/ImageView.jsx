import React from 'react';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native';
import { View, Colors } from 'react-native-ui-lib';

const ImageView = ({uri, width}) => {

    return (

        <View width={width} row centerV spread paddingH-2>
            <Image source={{ uri: uri }} contentFit='cover' recyclingKey={uri} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.bg2 }}/>
            <ActivityIndicator size='small' color={Colors.primary}/>
        </View>

    );

};

export default React.memo(ImageView);