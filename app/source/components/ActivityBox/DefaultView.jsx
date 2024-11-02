import React from 'react'
import { Image } from 'expo-image';
import { View, Text, Colors } from 'react-native-ui-lib';

const DefaultView = ({image, msg, width}) => {

    return (

        <View top row centerV spread paddingR-16 width={width}>
            <View width={width-62}>
                <Text text70R textC1>{msg}</Text>
            </View>
            <View center height={40} width={40}>
                <Image source={{ uri: image }} recyclingKey={image} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bg2 }}/>
            </View>
        </View>

    );

};

export default React.memo(DefaultView);