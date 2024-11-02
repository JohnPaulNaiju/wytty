import React from 'react';
import { Icon, DynamicIsland } from '../components';
import { View, Text, Colors} from 'react-native-ui-lib';

export const toastConfig = ({
    default: ({ text1 }) => (
        <View paddingH-14 paddingV-7 bg-border centerH br60>
            <Text textC1 text70R center>{text1}</Text>
        </View>
    ),
    woint: ({ text1 }) => (
        <View row centerV br60 paddingH-8 paddingV-6 bg-green>
            <View padding-3 br40 bg-white>
                <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
            </View>
            <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>{text1} +</Text>
        </View>
    ),
    dynamicIsland: ({ props }) => <DynamicIsland props={props}/>,
});