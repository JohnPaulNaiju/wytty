import React from 'react';
import Icon from './Icon';
import { timeAgo } from '../functions';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const FolderBox = ({name, timestamp, items, size, onPress}) => {

    return (

        <TouchableOpacity marginT-16 onPress={onPress}>
            <View width={width} height={60} row centerV paddingH-16>
                <Icon 
                name='ios-folder' 
                type='ion' 
                size={50} color={Colors.grey20}/>
                <View marginL-16>
                    <Text text70M textC1>{name}</Text>
                    <Text text80R textC2>{items||0} items • {Math.round(size||0)} MB • {timeAgo(timestamp)}</Text>
                </View>
            </View>
        </TouchableOpacity>

    );

};

export default React.memo(FolderBox);