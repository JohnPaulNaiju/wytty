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
        <View row centerV width={width} height={76}>
            <View center width={width*0.2} height={76}>
                <View br100 bg-bg2 width={56} height={56}/>
            </View>
            <View paddingH-16 flex centerV>
                <View br40 bg-bg2 height={16} width={150}/>
                <View marginT-6 br40 bg-bg2 height={8} width={200}/>
            </View>
        </View>
    ));

    return (

        <View reanimated style={style}>
            {element}
            {element}
            {element}
            {element}
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