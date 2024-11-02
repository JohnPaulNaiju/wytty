import React from 'react';
import Icon from './Icon';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const RequestBox = ({dp, name, status, admin, onUserPress, onAccept, onCancel}) => {

    const text = React.useMemo(() => status==='requested'?`${name?.slice(0,15)} wants to join`:`${name?.slice(0,15)} request to join was ${status}`);

    const footer = React.useMemo(() => (
        <View row centerV>
            <TouchableOpacity paddingH-16 onPress={onAccept}>
                <Icon name='check' size={16} color={Colors.primary}/>
            </TouchableOpacity>
            <TouchableOpacity paddingH-16 onPress={onCancel}>
                <Icon name='close' size={16} color={Colors.red}/>
            </TouchableOpacity>
        </View>
    ));

    return (

        <View width={width} bg-line row centerV spread marginV-6 paddingV-6 paddingH-16>
            <TouchableOpacity onPress={onUserPress}>
                <View row centerV>
                    <Image source={{ uri: dp }} recyclingKey={dp} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain'  style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.bg2 }}/>
                    <Text textC2 text80R marginL-6 style={{ fontStyle: 'italic' }}>{text}</Text>
                </View>
            </TouchableOpacity>
            {(admin&&status==='requested')?footer:null}
        </View>

    );

}

export default React.memo(RequestBox);