import React from 'react';
import Icon from './Icon';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const ListItemWithAvatar = ({url, title, subtitle, verified, onPress, onLongPress, right}) => {

    const Width = React.useMemo(() => width-80);

    const rightview = React.useMemo(() => (
        <View center width={Width*0.3} height={70}>
            {right}
        </View>
    ));

    const avatar = React.useMemo(() => (
        <View center width={80} height={70}>
            <Image 
            recyclingKey={url} 
            source={{ uri: url }} 
            placeholderContentFit='contain' 
            placeholder='https://shorturl.at/PQTW4' 
            style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.line }}/>
        </View>
    ));

    const box = React.useMemo(() => (
        <View paddingR-6 width={right?Width*0.7:Width}>
            <View row centerV>
                <Text textC1 numberOfLines={1} text70 marginR-6 style={{ fontWeight: 'bold' }}>{title}</Text>
                { verified? <Icon name='verified' size={14}/> : null}
            </View>
            <Text textC2 text80R numberOfLines={1}>{subtitle}</Text>
        </View>
    ));

   return (

        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
            <View row centerV width={width} height={70}>
                {avatar}
                {box}
                {right?rightview:null}
            </View>
        </TouchableOpacity>

    );

}

export default React.memo(ListItemWithAvatar);