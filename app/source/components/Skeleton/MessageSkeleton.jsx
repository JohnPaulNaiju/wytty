import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

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

    return (

        <View reanimated width={width} height={height} style={style}>
            <View marginT-16 left paddingH-12 width={width}>
                <View br40 bg-bg2 height={80} width={width*0.6}/>
            </View>
            <View marginT-16 right paddingH-12 width={width}>
                <View br40 bg-bg2 height={100} width={width*0.7}/>
            </View>
            <View marginT-16 left paddingH-12 width={width}>
                <View br40 bg-bg2 height={40} width={width*0.7}/>
            </View>
            <View marginT-16 right paddingH-12 width={width}>
                <View br40 bg-bg2 height={90} width={width*0.5}/>
            </View>
            <View marginT-16 left paddingH-12 width={width}>
                <View br40 bg-bg2 height={50} width={width*0.4}/>
            </View>
            <View marginT-16 right paddingH-12 width={width}>
                <View br40 bg-bg2 height={80} width={width*0.7}/>
            </View>
            <View marginT-16 left paddingH-12 width={width}>
                <View br40 bg-bg2 height={60} width={width*0.6}/>
            </View>
            <View marginT-16 right paddingH-12 width={width}>
                <View br40 bg-bg2 height={120} width={width*0.6}/>
            </View>
            <View marginT-16 left paddingH-12 width={width}>
                <View br40 bg-bg2 height={85} width={width*0.7}/>
            </View>
            <View marginT-16 right paddingH-12 width={width}>
                <View br40 bg-bg2 height={70} width={width*0.4}/>
            </View>
        </View>

    );

};

export default React.memo(TribeBoxSkeleton);