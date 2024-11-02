import React from 'react';
import Icon from './Icon';
import { Pressable } from 'react-native';
import { View, Colors } from 'react-native-ui-lib';

const Scroller = ({show, up, onPress}) => {

    if(!show) return null;

    return (

        <View absB absR margin-16>
            <Pressable onPress={onPress}>
                <View width={34} height={34} borderRadius={20} center bg-bg2>
                    <Icon name={up?'keyboard-arrow-up':'keyboard-arrow-down'} color={Colors.textC2}/>
                </View>
            </Pressable>
        </View>

    );

};

export default React.memo(Scroller);