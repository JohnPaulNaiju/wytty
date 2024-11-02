import React from 'react';
import { useData } from '../../hooks';
import { Input } from '../../components';
import Toast from 'react-native-toast-message';
import { openLink, regex } from '../../functions';
import { RegisterUser, getUsername } from './helper';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Button } from 'react-native-ui-lib';
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const hint = `• A Username\n   - Must be unique\n   - Atleast 3 characters\n   - can't be changed later\n   - has no spaces\n   - has no upper cases\n   - has no periods at the ends\n   - can have periods and underscore\n• Password must contain\n   - Atleast 1 Upper case\n   - Atleast 1 Lower case\n   - Atleast 1 number\n   - Atleast 8 characters`;

export default function LogUp() {

    const navigation = useNavigation();
    const { offline } = useData();

    const [loading, setLoading] = React.useState(false);

    const [data, setData] = React.useState({
        username: '',
        password: '',
    });

    const [isValid, setIsValid] = React.useState({
        username: false,
        password: false,
    });

    const seeError = React.useMemo(() => ((data.password && !isValid.password)||(data.username && !isValid.username)));

    const handleChange = React.useCallback((value) => {
        setData((state) => ({ ...state, ...value }));
    }, [setData]);

    const showPopUp = () => {
        Keyboard.dismiss();
        Toast.show({ 
            props: {
                type: 'bot',
                text: hint,
            },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
    };

    const checkUsername = async() => {
        const USERNAME = data.username.toLowerCase();
        const result = await getUsername(USERNAME);
        setIsValid((state) => ({
            ...state,
            username: !result&&regex.UserName.test(USERNAME),
        }));
        setLoading(false);
    };

    const handleAuth = async(userData) => {
        setLoading(true);
        await RegisterUser(userData, setLoading);
    };

    React.useEffect(() => {
        if(offline){
            setIsValid((state) => ({
                ...state,
                username: false,
            }));
            return;
        }
        const USERNAME = data.username;
        if(USERNAME.trim().length===0){
            setLoading(false);
            setIsValid((state) => ({
                ...state,
                username: false,
            }));
        }else{
            setLoading(true);
            const delayDebounceFn = setTimeout(() => {
                checkUsername();
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [data.username, offline]);

    React.useEffect(() => {
        setIsValid((state) => ({
            ...state,
            password: regex.password.test(data.password)
        }));
    }, [data.password, setIsValid]);

    const footer = React.useMemo(() => (
        <View center marginT-26>
            <Text text80R textC2>By clicking continue, you agree to follow our</Text>
            <View row centerV marginT-6>
                <TouchableOpacity onPress={() => openLink('wytty.org/#/terms')}>
                    <Text text80R textC1>Terms, </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink('wytty.org/#/privacy-policy')}>
                    <Text text80R textC1>privacy policy</Text>
                </TouchableOpacity>
                <Text text80R textC1> and </Text>
                <TouchableOpacity onPress={() => openLink('wytty.org/#/community-guidelines')}>
                    <Text text80R textC1>community guidelines</Text>
                </TouchableOpacity>
            </View>
        </View>
    ));

    return (

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={isAndroid?null:'padding'}>
            
            <View flex useSafeArea bg-bg1 center>

                <Text text40 textC1>Wყƚƚყ</Text>
                <Text textC2 text60R>Create New Account</Text>

                <Input 
                marginT-26
                w={width*0.8}
                maxLength={20}
                loading={loading}
                placeholder="Username" 
                val={data.username}
                valid={(data.username && isValid.username)}
                notValid={(data.username && !isValid.username)}
                onChange={ e => handleChange({ username: e }) }/>

                <Input 
                secure
                marginT-16 
                w={width*0.8}
                maxLength={20}
                placeholder="Password" 
                val={data.password}
                valid={(data.password && isValid.password)}
                notValid={(data.password && !isValid.password)}
                onChange={e => handleChange({ password: e })}/>

                {seeError?
                <View right width={width*0.8}>
                    <TouchableOpacity marginT-12 marginR-6 onPress={showPopUp}>
                        <Text primary text80R>See suggestion</Text>
                    </TouchableOpacity>
                </View>:null}

                <Button 
                label='Continue'
                borderRadius={15} enableShadow
                onPress={() => handleAuth(data)}
                bg-primary white text70 marginT-26
                labelStyle={{ fontWeight: "bold" }}
                style={{ width: width*0.8, height: 50 }}
                disabled={offline||Object.values(isValid).includes(false)||loading}/>

                {!Object.values(isValid).includes(false)&&!loading?footer:null}

                <TouchableOpacity padding-12 marginT-16 onPress={() => navigation.navigate('LogIn')}>
                    <Text textC2 text80R>Already have an account? <Text textC1 text80R>Log In</Text></Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>

    );

};