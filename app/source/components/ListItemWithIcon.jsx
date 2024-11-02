import React from 'react';
import Icon from './Icon';
import { Dimensions } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const ListItemWithIcon = ({ type, icon, color, title, subtitle, onPress, disablePress, right, ...rest }) => {

    const rightview = React.useMemo(() => (
        <View center width={width*0.2}>
            {right}
        </View>
    ));

    return (

        <TouchableOpacity activeOpacity={disablePress?1:0.5} onPress={onPress}>
            <View width={width} paddingV-16 row {...rest}>
                <View width={width*0.18} center>
                    <Icon type={type} name={icon} color={color||null}/>
                </View>
                <View width={right?width*0.6:width*0.75} centerV>
                    <Text text70 textC1>{title}</Text>
                    { subtitle ? <Text text80 textC2>{subtitle}</Text> : null }
                </View>
                {right?rightview:null}
            </View>
        </TouchableOpacity>

    );

};

export default React.memo(ListItemWithIcon);