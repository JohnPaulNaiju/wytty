import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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
        <View br40 bg-bg2 marginT-16 width={width*0.7} height={200}/>
    ));

    return (

        <View reanimated centerH width={width} style={style}>
            {element}
            {element}
            {element}
            {element}
            {element}
        </View>

    );

};

export default React.memo(TribeBoxSkeleton);