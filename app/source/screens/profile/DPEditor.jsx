import React from 'react';
import { updateDp } from './helper';
import { Back } from '../../components';
import ViewShot from "react-native-view-shot";
import { CardStyleInterpolators } from '@react-navigation/stack';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Colors, Image, TouchableOpacity } from 'react-native-ui-lib';
import { Easing, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';

export default function DPEditor() {

    const navigation = useNavigation();
    const route = useRoute();

    const { dplink } = route.params;

    const dpRef = React.useRef(null);

    const rotation = useSharedValue(0);

    const [show, setShow] = React.useState(true);

    const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

    const captureSave = async() => {
        const uri = await dpRef.current?.capture();
        setShow(state => !state);
        requestAnimationFrame(() => {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 2000,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        });
        await updateDp(uri);
        const actions = StackActions.pop(2);
        navigation.dispatch(actions);
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => null,
            headerLeft: () => <Back/>,
            headerRight: () => (show?
                <TouchableOpacity marginR-22 onPress={captureSave}>
                    <Text text60 textC1>Use</Text>
                </TouchableOpacity>:null
            ),
        });
    }, [navigation, show]);

    return (

        <View flex useSafeArea bg-bg1 center>
            <ViewShot ref={dpRef}>
                <View 
                br100 
                width={200} 
                height={200} 
                style={{ overflow: 'hidden' }}>
                    <Image 
                    style={{ flex: 1 }}
                    resizeMode='cover' 
                    source={{ uri: dplink }}/>
                    <View absH absV br100 reanimated flex 
                    style={[style, { 
                        borderLeftWidth: 5, 
                        borderLeftColor: show?Colors.transparent:Colors.primary  
                    }]}/>
                </View>
            </ViewShot>
        </View>

    );

};