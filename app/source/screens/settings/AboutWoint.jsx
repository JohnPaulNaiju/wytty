import React from 'react';
import { Image } from 'expo-image';
import { useData } from '../../hooks';
import { Back, Icon } from '../../components';
import { formatNumber } from '../../functions';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, FlatList, Platform } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

export default function AboutWoint() {

    const navigation = useNavigation();
    const { profile } = useData();

    const rotate1 = useSharedValue(20);
    const rotate2 = useSharedValue(-10);

    const rotateStyle1 = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate1.value}deg`}] }));
    const rotateStyle2 = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate2.value}deg`}] }));

    const onScroll = (e) => {
        const newE = (1/100)*e.nativeEvent.contentOffset.y;
        rotate1.value = rotate1.value+newE;
        rotate2.value = rotate2.value-newE;
    };

    const rePosition = () => {
        requestAnimationFrame(() => {
            rotate1.value = withTiming(20, { duration: 300 });
            rotate2.value = withTiming(-10, { duration: 300 });
        });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60> Woint</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const inside = React.useMemo(() => (
        <TouchableOpacity activeOpacity={1} onPress={rePosition}>
            <View center flex>
                <Text center text30 black style={{ fontWeight: isAndroid?'bold':'900' }}>YOU{"\n"}EARNED{"\n"}{formatNumber(profile?.woint||0)} WOINTS</Text>
                <Text textC2 text70R center marginH-16 marginT-6>Enabling our creators to earn through our platform</Text>
                <View marginT-16 row center spread>
                    <View row centerV br60 paddingH-8 paddingV-6 bg-green>
                        <View padding-3 br40 bg-white>
                            <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
                        </View>
                        <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>{formatNumber(profile?.woint||0)} WP</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    ));

    const box = React.useMemo(() => (
        <View width={width} centerH marginT-36>
            <View marginT-56 width={width*0.68} height={width*0.68} center>
                <View width='100%' height='100%' br60 backgroundColor='#414242' reanimated style={rotateStyle1}>
                    <View width='100%' height='100%' br60 backgroundColor='#b3b4b4' reanimated style={rotateStyle2}>
                        <View center width='100%' height='100%' br60 backgroundColor='#ffffff' reanimated style={rotateStyle2}>
                            {inside}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    ));

    const box1 = React.useMemo(() => (
        <View width={width} height={200} center>
            <Text text10BO textC1>Daily +1 WP</Text>
            <View row centerV marginT-16>
                <Text text70R textC2>Earn</Text>
                <View row centerV br60 paddingH-6 paddingV-4 bg-green marginH-12>
                    <View padding-3 br40 bg-white>
                        <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
                    </View>
                    <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>+1 WP</Text>
                </View>
                <Text text70R textC2>by signing in every day</Text>
            </View>
        </View>
    ));

    const box2 = React.useMemo(() => (
        <View width={width} center row>
            <Image
            contentFit='contain'
            source={{ uri: 'https://cdn140.picsart.com/307276597177211.png' }}
            style={{ width: width*0.5, height: width*0.5 }}/>
            <View width={width*0.5} height={width*0.5} centerV right paddingR-16>
                <Text text30 textC1 style={{ fontWeight: isAndroid?'bold':'900' }}>EARN</Text>
                <View row centerV br60 paddingH-6 paddingV-4 bg-green marginV-6>
                    <View padding-3 br40 bg-white>
                        <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
                    </View>
                    <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>+5 WP</Text>
                </View>
                <View right>
                    <Text textC2 text60R>FOR EVERY</Text>
                    <Text textC2 text60R>PUBLIC POST</Text>
                </View>
            </View>
        </View>
    ));

    const box5 = React.useMemo(() => (
        <View width={width} marginT-6 center paddingH-16 bg-bg2>
            <Text text80R textC2 marginT-26>Note: We currently don't run ads and don't have any ad revenue. Ad revenue sharing starts only when we start running ads and we have enough profit after operational costs. But still you can start collecting the woints. Ad revenue will be shared based on your woints. Also we will not run too much and disturbing ads like other platforms.</Text>
            <View height={30}/>
        </View>
    ));

    const header = React.useMemo(() => (
        <View flex width={width} bg-bg1>
            {box}
            <Text text70R textC2 marginH-26 marginT-56 center>When we start making revenue from ads, 50% of the ad revenue will be shared among our creators based on their woints.</Text>
            <Text text50 textC1 marginH-26 marginT-46 center>HOW TO EARN WOINTS</Text>
            {box1}
            {box2}
            {box5}
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg2>
            <FlatList
            style={{ flex: 1 }}
            onScroll={onScroll}
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};

// const box3 = React.useMemo(() => (
//     <View width={width} marginT-36 center>
//         <View right>
//             <Text grey20 text20 style={{ fontWeight: isAndroid?'bold':'900' }}>2X BOOST</Text>
//             <Text textC2 text80R marginTop={-10}>on Ad revenue sharing</Text>
//         </View>
//         <View row centerV marginT-4>
//             <Text text60R textC2 marginR-6>For verified users</Text>
//             <Icon name='verified' size={18}/>
//         </View>
//         <Text text70R textC2>Constantly contribute to your tribe to get verified</Text>
//     </View>
// ));

// const box4 = React.useMemo(() => (
//     <View width={width} marginT-56 center row centerV>
//         <View width={width*0.5} center>
//             <View row centerV br100 paddingH-8 paddingV-5 bg-green marginV-6>
//                 <View padding-4 br60 bg-white>
//                     <Icon name='fire' type='font-awesome' color={Colors.bg1}/>
//                 </View>
//                 <Text bg1 text60 marginL-6 style={{ fontWeight: isAndroid?'bold':'900' }}>+2 WP</Text>
//             </View>
//             <Text textC2 text70R>Everyday</Text>
//         </View>
//         <View width={width*0.5} centerV>
//             <Text textC2 text60R>For</Text>
//             <Text textC1 text30 style={{ fontWeight: isAndroid?'bold':'900' }}>300+</Text>
//             <Text textC2 text60R>Connections</Text>
//         </View>
//     </View>
// ));