import React from 'react';

const DateView = ({timestamp}) => {

    const { View, Text } = require('react-native-ui-lib');
    const { Dimensions } = require('react-native');
    const { width } = Dimensions.get('window');

    return (

        <View width={width} center marginV-16>
            <View paddingH-16 br30 height={32} centerV bg-bg2>
                <Text textC2 text80R>{timestamp}</Text>
            </View>
        </View>

    );

};

const Day = ({ time, ptime }) => {

    const currentTimeStamp = React.useMemo(() => time?.toDateString(), [time]);
    const precedingTimeStamp = React.useMemo(() => ptime?.toDateString(), [ptime]);
    const showDay = React.useMemo(() => currentTimeStamp!==precedingTimeStamp, [currentTimeStamp, precedingTimeStamp]);

    const timestamp = React.useMemo(() => {
        if(!showDay) return;
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        return currentTimeStamp===today.toDateString()?'Today':currentTimeStamp===yesterday.toDateString()?'Yesterday':currentTimeStamp;
    }, [currentTimeStamp]);

    return showDay?<DateView timestamp={timestamp}/>:null;

};

export default React.memo(Day);