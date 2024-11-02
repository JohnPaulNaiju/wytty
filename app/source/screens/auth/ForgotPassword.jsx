import React from 'react';
import { auth } from '../../hooks';
import { findAccount } from './helper';
import Toast from 'react-native-toast-message';
import { Back, Input, Alert } from '../../components';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, Button } from 'react-native-ui-lib';
import { Dimensions, KeyboardAvoidingView, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

export default function ForgotPassword() {

    const navigation = useNavigation();

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const [searching, setSearching] = React.useState({
        loading: false,
        found: 0, //0 empty, 1 found, 2 not found
    });

    const hiddenEmail = React.useMemo(() => email?.replace(/(.{2}).+(.{2}@.+)/, '$1****$2'));

    const handleSearch = React.useCallback((value) => {
        setSearching((state) => ({ ...state, ...value }));
    }, []);

    const search = async() => {
        handleSearch({ loading: true });
        const data = await findAccount(username);
        handleSearch({ loading: false, found: data===false?2:1 });
        if(data!==false) setEmail(data?.email);
    };

    const sendEmail = (EMAIL) => {
        handleSearch({ loading: true, found: 0 });
        sendPasswordResetEmail(auth, EMAIL).then(() => {
            setOpen(state => !state);
        }).catch(() => {
            Toast.show({ text1: 'Error sending email' });
        });
    };

    const alert = React.useMemo(() => (
        <Alert 
        title='Email sent!' 
        subtitle={`Password reset email was send to \n${hiddenEmail}\n If you didn't recieve please check the spam folder.`}
        open={open}
        options={[
            {
                text: 'Ok',
                color: Colors.textC1,
                onPress: () => navigation.goBack()
            }
        ]}
        close={() => setOpen(state => !state)}/>
    ));

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerLeft: () => <Back/>,
            headerTitle: () => <Text textC1 text60>Forgot Password</Text>,
            headerRight: () => null,
        });
    }, [navigation]);

    return (

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={isAndroid?null:'padding'} keyboardVerticalOffset={60}>
            
            <View flex useSafeArea bg-bg1 center>
                <View paddingT-16 bg-bg2 width={width*0.85} paddingB-26 br40 centerH style={{ borderWidth: 1, borderColor: Colors.bg2 }}>
                    <Text textC1 text60 marginT-26>Find Your Account</Text>
                    <Input 
                    bg-bg2
                    marginT-26
                    w={width*0.7}
                    val={username}
                    placeholder='Your username' 
                    loading={searching.loading}
                    onChange={e => setUsername(e)}/>
                    <Button 
                    label='Search'
                    onPress={search}
                    borderRadius={15} enableShadow
                    bg-primary white text70 marginT-26
                    labelStyle={{ fontWeight: 'bold' }}
                    style={{ width: width*0.7, height: 50 }}
                    disabled={username.trim().length===0||searching.loading}/>
                    { searching.found===2 ? <Text textC1 text70M marginT-40>Account not found</Text> : null }
                    { searching.found===1&&email ? 
                    <View marginT-40 center>
                        <Text textC1 text70M>We can send email to reset password</Text>
                        <Text textC2 text70R>Email: {email?.replace(/(.{2}).+(.{2}@.+)/, '$1****$2')}</Text>
                        <Button 
                        borderRadius={15}
                        onPress={() => sendEmail(email)} enableShadow
                        labelStyle={{ fontWeight: 'bold' }}
                        bg-primary white text70 marginT-26
                        label='Send password reset email'
                        style={{ width: width*0.7, height: 50 }}/>
                    </View> : null }
                    { searching.found===1&&!email ? <Text text70M textC1 marginT-26>This user doesn't have backup-email</Text> : null}
                </View>
                {alert}
            </View>
        </KeyboardAvoidingView>

    );

};