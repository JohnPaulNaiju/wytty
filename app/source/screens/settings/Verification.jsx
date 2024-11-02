import React from 'react';
import { useData } from '../../hooks';
import { Back, Icon } from '../../components';
import { formatNumber } from '../../functions';
import { requestForVerification } from './helper';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Platform, FlatList } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

export default function Verification() {

    const navigation = useNavigation();
    const { profile } = useData();

    const eligible = React.useMemo(() => (!profile?.requestedForVerification)&&(!profile?.verified)&&profile?.woint>999&&profile?.connection>249);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View row centerV>
                    <Text textC1 text60 marginR-6>Verification</Text>
                    <Icon name='verified'/>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View flex>
            <Text center text10 textC1 marginT-36 style={{ fontWeight: isAndroid?'bold':'900' }}>Become{"\n"}a Creator</Text>
            <Text textC2 text70R center>Get verified and identify as a creator</Text>
            <View width={width} marginT-6 center>
                {/* <Text grey20 text20 style={{ fontWeight: isAndroid?'bold':'900' }}>2X BOOST</Text>
                <Text text60R textC2>On ad revenue sharing</Text> */}
                <Text text70R textC2>Constantly contribute to your tribe to get verified</Text>
            </View>
            <View width={width} height={180} row marginT-26>
                <View flex padding-8>
                    <View center flex br60 bg-white>
                        <Text text60 black center>Your stats</Text>
                        <View row centerV br60 paddingH-6 paddingV-4 bg-green marginT-16>
                            <View padding-3 br40 bg-white>
                                <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
                            </View>
                            <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>{formatNumber(profile?.woint||0)} WP</Text>
                        </View>
                        <View row centerV br60 paddingH-6 paddingV-4 bg-black marginT-16>
                            <View padding-3 br40 bg-white>
                                <Icon name='users' type='font-awesome' size={14} color={Colors.bg1}/>
                            </View>
                            <Text textC1 text80 marginL-6 style={{ fontWeight: 'bold' }}>{formatNumber(profile?.connection||0)} Connections</Text>
                        </View>
                    </View>
                </View>
                <View flex padding-8>
                    <View center flex br60 bg-white>
                        <Text text60 black center>Required</Text>
                        <View row centerV br60 paddingH-6 paddingV-4 bg-green marginT-16>
                            <View padding-3 br40 bg-white>
                                <Icon name='fire' type='font-awesome' size={14} color={Colors.bg1}/>
                            </View>
                            <Text bg1 text80 marginL-6 style={{ fontWeight: 'bold' }}>1000 WP</Text>
                        </View>
                        <View row centerV br60 paddingH-6 paddingV-4 bg-black marginT-16>
                            <View padding-3 br40 bg-white>
                                <Icon name='users' type='font-awesome' size={14} color={Colors.bg1}/>
                            </View>
                            <Text textC1 text80 marginL-6 style={{ fontWeight: 'bold' }}>249+ Connections</Text>
                        </View>
                    </View>
                </View>
            </View>
            {eligible?
            <TouchableOpacity marginT-36 onPress={requestForVerification}>
                <Text primary text60 center>Request for verification</Text>
            </TouchableOpacity>:null}
            <Text text50 textC1 center marginT-36>Verified means Creator</Text>
            <Text textC2 text70R center marginH-26>Verified accounts are identified as 'Creator' on this platform</Text>
            <Text textC2 text80R marginH-16 marginT-26>Note: Verified accounts are identified as 'Creator' on this platform. Verification process will take time, as we need to check your contributions to the community. We'll notify you once you get verified. Verified accounts will have 2X Boost in Ad revenue sharing.</Text>
        </View>
    ));

    return (

        <View flex bg-bg1 useSafeArea>
            
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={50}/>}/>
        </View>

    );

};