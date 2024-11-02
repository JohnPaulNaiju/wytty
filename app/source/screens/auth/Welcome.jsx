import React from 'react';
import { LoginUser } from './helper';
import { useAccounts } from '../../hooks';
import { banner, logoimg } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, ActivityIndicator, ImageBackground } from 'react-native';
import { View, Text, Image, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('screen');

export default function Welcome() {

    const navigation = useNavigation();

    const { accounts, getAccount } = useAccounts();

    const [util, setUtil] = React.useState({
        loading: true,
        open: false,
        alert: false,
    });

    const get = async() => {
        await getAccount();
        handleUtil({ loading: false });
    };

    const onpress = () => {
        if(util.loading) return;
        if(accounts.length===0) navigation.navigate('LogUp');
        else{ 
            handleUtil({ loading: true });
            LoginUser(accounts[0], handleUtil);
        }
    };

    const handleUtil = React.useCallback((value) => {
        setUtil(state => ({ ...state, ...value }));
    }, [setUtil]);

    React.useEffect(() => {
        get();
    }, []);

    const div = React.useMemo(() => (
        <View flex centerV paddingL-16 height={50}>
            {util.loading?<Text text70 textC2>Please wait...</Text>:
            <View>
                {accounts.length===0?
                <Text text70 textC1>Welcome to Wყƚƚყ 👋</Text>
                :
                <Text text70 icon>Log in with</Text>}
            </View>}
            {util.loading?
            <View left marginT-6>
                <ActivityIndicator size='small' color={Colors.primary}/>
            </View>
            :
            <View>
                {accounts.length===0?
                <Text text70 primary>Get started</Text>
                :
                <Text text70 primary numberOfLines={1}>{accounts[0]?.username}</Text>}
            </View>}
        </View>
    ));

    return (

        <View flex bg-black centerH>
            <ImageBackground resizeMode='cover' source={banner} style={{ flex: 1, width: width }}>
                <View height={height*0.8}/>
                <View useSafeArea flex centerH>
                    <TouchableOpacity activeOpacity={0.2} onPress={onpress}>
                        <View br40 row centerV spread width={width*0.93} height={80} backgroundColor={Colors.black+'DF'} style={{ borderWidth: 1.5, borderColor: Colors.line }}>
                            {div}
                            <View center width={100} height={80}>
                                <Image resizeMode='contain' source={logoimg} width={50} height={50}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {(!util.loading&&accounts.length>0)?
                    <TouchableOpacity activeOpacity={0.5} paddingV-22 paddingH-16 onPress={() => navigation.navigate('LogUp')}>
                        <Text textC2 text70R>Create account</Text>
                    </TouchableOpacity>:null}
                </View>
            </ImageBackground>
        </View>

    );

};