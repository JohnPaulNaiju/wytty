import React from 'react';
import { View } from 'react-native-ui-lib';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const TribeBoxSkeleton = () => {

    const opacity = useSharedValue(1);

    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

    React.useEffect(() => {
        requestAnimationFrame(() => {
            opacity.value = withRepeat(
                withTiming(0.5, { 
                    duration: 500, 
                    easing: Easing.inOut(Easing.ease) 
                }),
                -1,
                true
            );
        });
    }, []);

    const element = React.useMemo(() => (
        <View center width={74} height={65}>
            <View bg-bg2 width={60} height={60} borderRadius={30}/>
        </View>
    ));

    return (

        <View reanimated row style={style}>
            {element}
            {element}
            {element}
            {element}
            {element}
            {element}
        </View>

    );

};

export default React.memo(TribeBoxSkeleton);