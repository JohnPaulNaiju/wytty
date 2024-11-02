import React from 'react';
import Icon from './Icon';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const EmptyState = ({onPress, title, subtitle, btTitle, icon, type, bgColor, ...rest}) => {

    return (

        <View center flex backgroundColor={bgColor?bgColor:Colors.bg1} {...rest}>
            <Icon name={icon} size={80} type={type} color={Colors.icon}/>
            {title?<Text text60 icon center marginT-16 marginH-46>{title}</Text>:null}
            {subtitle?<Text text70R icon center marginH-46>{subtitle}</Text>:null}
            { onPress ? 
            <TouchableOpacity marginT-16 onPress={onPress}>
                <Text primary text70 style={{ fontWeight: 'bold' }}>{btTitle}</Text>
            </TouchableOpacity> : null }
        </View>

    );

};

export default React.memo(EmptyState)