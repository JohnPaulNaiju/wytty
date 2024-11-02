import React from 'react';
import { LoginUser } from './helper';
import { useAccounts } from '../../hooks';
import { regex, removeAccount } from '../../functions';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Button, Colors } from 'react-native-ui-lib';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Input, ListItemWithAvatar, ActionSheet, Alert, Loader } from '../../components';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

export default function LogIn() {

    const navigation = useNavigation();
    const { accounts, getAccount, setAccounts } = useAccounts();

    const accIndex = React.useRef(0);

    const [util, setUtil] = React.useState({
        loading: false,
        open: false,
        alert: false,
    });

    const [data, setData] = React.useState({
        username: '',
        password: '',
    });

    const [isValid, setIsValid] = React.useState({
        username: false,
        password: false,
    });

    const LogIn = (props) => {
        handleUtil({ loading: true });
        LoginUser(props, handleUtil);
    };

    const handleChange = React.useCallback((value) => {
        setData((state) => ({ ...state, ...value }));
    }, [setData]);

    const handleUtil = React.useCallback((value) => {
        setUtil(state => ({ ...state, ...value }));
    }, [setUtil]);

    React.useEffect(() => {
        setIsValid((state) => ({
            ...state,
            username: regex.UserName.test(data.username),
            password: data.password.length>0
        }));
    }, [data, setIsValid]);

    React.useEffect(() => {
        getAccount();
    }, []);

    const RemoveAccount = (i) => {
        handleUtil({ open: false });
        setTimeout(() => {
            accIndex.current = i;
            handleUtil({ alert: true });
        }, 400);
    };

    const renderItem = React.useCallback(({item, index}) => (
        <ListItemWithAvatar 
        title={item?.username||'User'} 
        subtitle='Account in this phone' 
        url={item?.dp} 
        onPress={() => { 
            if(!util.loading){
                handleUtil({ open: false });
                LogIn(item);
            } 
        }} 
        onLongPress={() => RemoveAccount(index)}/>
    ));

    const children = React.useMemo(() => (
        <FlatList
        data={accounts}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        showsVerticalScrollIndicator={false}/>
    ));

    const alert = React.useMemo(() => (
        <Alert 
        open={util.alert} 
        close={() => handleUtil({ alert: false })} 
        title='Remove Account'
        subtitle='Remove account from this phone'
        showCancel
        options={[
            {
                text: 'Remove',
                color: Colors.red,
                onPress: () => removeAccount(accIndex.current, accounts, setAccounts)
            }
        ]}/>
    ));

    const action = React.useMemo(() => (
        <ActionSheet 
        open={util.open} 
        children={children} 
        close={() => handleUtil({ open: false })}/>
    ));

    return (

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={isAndroid?null:'padding'}>
            
            <View flex useSafeArea bg-bg1 center>
                
                <Text text40 textC1>Wყƚƚყ</Text>
                <Text textC2 text60R>Welcome back!</Text>

                <Input 
                marginT-26
                w={width*0.8}
                maxLength={20}
                val={data.username} 
                placeholder="Username"
                valid={(data?.username && isValid.username)}
                notValid={(data?.username && !isValid.username)}
                onChange={ e => handleChange({ username: e }) }/>

                <Input 
                secure 
                marginT-16
                w={width*0.8}
                val={data.password} 
                placeholder='Password' 
                onChange={ e => handleChange({ password: e }) }/>

                <View width={width*0.8} spread row centerV marginT-16>
                    <TouchableOpacity padding-6 onPress={() => navigation.goBack()}>
                        <Text textC1 text80R>New here?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity padding-6 onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text textC2 text80R>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View marginT-16>
                    {util.loading?
                    <View height={50} width={width} center>
                        <Loader size={50}/>
                    </View>
                    : 
                    <Button 
                    disabled={Object.values(isValid).includes(false)}
                    onPress={() => LogIn(data)} 
                    borderRadius={15} enableShadow
                    labelStyle={{ fontWeight: 'bold' }}
                    style={{ width: width*0.8, height: 50 }}
                    bg-primary white text70
                    label='Continue'/> }
                </View>

                {accounts.length>0?
                <View absB absH useSafeArea centerH marginB-36 width={width}>
                    <TouchableOpacity padding-12 marginT-16 onPress={() => handleUtil({ open: true })}>
                        <Text textC2 text70R>Available accounts</Text>
                    </TouchableOpacity>
                </View>:null}

            </View>
            {action}
            {alert}
        </KeyboardAvoidingView>

    );

};