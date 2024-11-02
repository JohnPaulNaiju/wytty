//refer https://icons.expo.fyi/Index for available icons
//
// expo guide: https://docs.expo.dev/guides/icons/

import React from 'react';
import { Colors } from 'react-native-ui-lib';
import { Feather, FontAwesome5, FontAwesome, MaterialCommunityIcons, Foundation, Ionicons, Fontisto, Entypo, AntDesign, Octicons, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';

const Icon = ({ type, color, size, name, ...rest }) => {

    const Color = React.useMemo(() => color || Colors.textC1);

    const IconSelector = React.useMemo(() => {
        switch(type){
            case 'feather':
                return <Feather name={name} color={Color} size={size || 24} {...rest}/>;
            case 'font-awesome':
                return <FontAwesome5 name={name} color={Color} size={size || 24} {...rest}/>;
            case 'font':
                return <FontAwesome name={name} color={Color} size={size || 24} {...rest}/>;
            case 'material-community':
                return <MaterialCommunityIcons name={name} color={Color} size={size || 24} {...rest}/>;
            case 'foundation':
                return <Foundation name={name} color={Color} size={size || 24} {...rest}/>;
            case 'ion':
                return <Ionicons name={name} color={Color} size={size || 24} {...rest}/>;
            case 'fontisto':
                return <Fontisto name={name} color={Color} size={size || 24} {...rest}/>;
            case 'entypo':
                return <Entypo name={name} color={Color} size={size || 24} {...rest}/>;
            case 'ant':
                return <AntDesign name={name} color={Color} size={size || 24} {...rest}/>;
            case 'octicons':
                return <Octicons name={name} color={Color} size={size || 24} {...rest}/>;
            case 'simple':
                return <SimpleLineIcons name={name} color={Color} size={size || 24} {...rest}/>;
            default:
                return <MaterialIcons name={name} color={Color} size={size || 24} {...rest}/>;
        };
    });

    return IconSelector;

};

export default React.memo(Icon);