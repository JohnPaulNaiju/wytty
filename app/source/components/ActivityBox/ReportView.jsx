import React from 'react';
import Icon from '../Icon';
import { View, Text } from 'react-native-ui-lib';

const ReportView = ({msg, support, login, width}) => {

    const select = React.useMemo(() => login?'phone-android':support?'support-agent':'security');

    return (

        <View top row centerV spread paddingR-16 width={width}>
            <View width={width-62}>
                <Text text70R textC1>{msg}</Text>
            </View>
            <View center height={40} width={40}>
                <Icon name={select} size={36}/>
            </View>
        </View>

    );

};

export default React.memo(ReportView);