import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PostSkeleton = () => {

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
        <View width={width} height={300}>
            <View row centerV paddingH-16 width={width} height={60}>
                <View bg-bg2 br100 width={44} height={44}/>
                <View marginL-16 bg-bg2 br60 width={140} height={20}/>
            </View>
            <View margin-16 bg-bg2 br60 width={200} height={20}/>
            <View flex centerH width={width}>
                <View flex bg-bg2 br40 width={width*0.93}/>
            </View>
        </View>
    ));

    return (

        <View reanimated style={style}>
            {element}
            {element}
            {element}
        </View>

    );

};

export default React.memo(PostSkeleton);