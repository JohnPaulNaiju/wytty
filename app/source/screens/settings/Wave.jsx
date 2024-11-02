import React from "react";
import { useData, limits } from '../../hooks';
import { Colors, Text, View } from 'react-native-ui-lib';
import { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";

const { storage } = limits;

const Wave = ({size}) => {

    const { profile } = useData();

    const used = React.useMemo(() => Math.round(profile?.storageused));
    const limit = React.useMemo(() => Math.round(profile?.storage || storage)/1000);
    const percent = React.useMemo(() => (used/Math.round(profile?.storage || storage))*100);

    const progress = useSharedValue(0);
    const SIZE = size;

    const style = useAnimatedStyle(() => ({ height: `${progress.value}%` }));

    React.useEffect(() => {
        requestAnimationFrame(() => {
            progress.value = withTiming(percent, { duration: 1000 });
        });
    }, [profile?.storageused, profile?.storage]);

    const maskElement = React.useMemo(() => (
        <View width={SIZE} height={SIZE} padding-16 spread absH absV>
            <Text white text60 marginT-6 marginL-2>Wყƚƚყ Cloυd</Text>
            <View>
                <Text white text70R>Occupied</Text>
                <Text white text70 style={{ fontWeight: 'bold' }}>{used||0} MB of {limit} GB</Text>
            </View>
        </View>
    ));

    return (

        <View center width={SIZE} height={SIZE}>
            <View width={SIZE} height={SIZE} bottom br60 style={{ overflow: 'hidden' }}>
                <View reanimated width={SIZE} style={style} backgroundColor={percent>=90?Colors.red:Colors.primary}/>
            </View>
            {maskElement}
        </View>

    );

};

export default React.memo(Wave);