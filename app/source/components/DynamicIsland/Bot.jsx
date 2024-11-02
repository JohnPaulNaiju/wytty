import React from 'react';
import Icon from '../Icon';
import TypeWriter from 'react-native-typewriter';
import { View, Colors } from 'react-native-ui-lib';
import { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const Bot = ({text}) => {

    const cursorOpacity = useSharedValue(1);

    const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));

    const cursor = <View reanimated width={2} height={18} bg-primary br10 style={cursorStyle}/>;

    React.useEffect(() => {
        requestAnimationFrame(() => {
            cursorOpacity.value = withRepeat(
                withTiming(0, { 
                    duration: 500, 
                    easing: Easing.inOut(Easing.ease) 
                }),
                -1,
                true
            );
        });
    }, []);

    return (

        <View row centerV paddingR-32>
            <View height='100%' top>
                <View padding-4 br60 bg-primary marginR-12>
                    <Icon name='dependabot' type='octicons' size={16}/>
                </View>
            </View>
            <TypeWriter typing={1} style={{ color: Colors.textC1, fontSize: 15 }}>{text}{cursor}</TypeWriter>
        </View>

    );

};

export default React.memo(Bot);