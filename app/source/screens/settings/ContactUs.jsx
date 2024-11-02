import React from 'react';
import { auth } from '../../hooks';
import { fileForHelp } from './helper';
import { regex } from '../../functions';
import { Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Back, Icon, Input, Loader } from '../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, TextField, Button } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

export default function ContactUs() {

    const navigation = useNavigation();

    const { email, phregex } = regex;

    const [data, setData] = React.useState({
        contact: '',
        issue: '',
    });

    const [isValid, setIsValid] = React.useState({
        contact: false,
        issue: false,
    });

    const [loading, setLoading] = React.useState(false);
    const [next, setNext] = React.useState(false);

    const disabled = Boolean(!isValid.issue||(data.contact&&!isValid.contact)||loading);

    const send = async(details) => {
        setLoading(state => !state);
        await fileForHelp(details);
        setLoading(state => !state);
        setNext(true);
    };

    const handleChange = React.useCallback((value) => {
        setData(state => ({
            ...state,
            ...value
        }));
    }, [setData]);

    React.useEffect(() => {
        setIsValid((state) => ({
            ...state,
            contact: (email.test(data.contact)||phregex.test(data.contact)),
            issue: data.issue.trim().length>5,
        }));
    }, [data, setIsValid]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View>
                    <Text textC1 text60>Wყƚƚყ Support</Text>
                    <Text text80R textC2>We love to here from you!</Text>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View width={width*0.9}>
            <Text text70 textC1 marginT-26 style={{ fontWeight: 'bold' }}>Username</Text>
            <Text text70R textC2>{auth.currentUser.displayName}</Text>
            <Text text70 textC1 marginT-26 style={{ fontWeight: 'bold' }}>Email or Phone</Text>
            <Text text80R textC2
            highlightStyle={{ color: Colors.textC1, fontWeight: 'bold' }}
            highlightString='phone number with country code'>Please provide with your email address or phone number with country code if you want us to contact you back. We will contact you back within 48hrs.</Text>
            <Input 
            marginT-16 
            len={320} val={data.contact}
            onChange={e => handleChange({ contact: e })}
            notValid={(data.contact&&!isValid.contact)}
            valid={(data.contact&&isValid.contact)}
            placeholder='Email or phone (optional)'/>
            <Text text70 textC1 marginT-26 style={{ fontWeight: 'bold' }}>Tell us what you have to say</Text>
            <View br20 bg-bg2 marginT-16 height={200} width={width*0.89} padding-16>
                <TextField
                value={data.issue}
                onChangeText={e => handleChange({ issue: e })}
                multiline text70R textC2
                placeholderTextColor={Colors.textC2}
                placeholder='Write here...' 
                maxLength={500}/>
            </View>

            { loading?
            <View marginT-16 center height={50}>
                <Loader size={50}/>
            </View>
            :
            <Button
            bg-primary text70 white
            label='Submit' marginT-26 onPress={() => send(data)} 
            borderRadius={8} disabled={disabled}
            style={{ width: 100, height: 40 }}/>}

            <Text textC1 text70R marginT-26>Or</Text>
            <Text textC2 text80R marginT-6 marginL-2>Compose an email to us: wyttyfeedbacks@gmail.com</Text>
        </View>
    ));

    const footer = React.useMemo(() => (
        <View flex center>
            <Icon name='verified' type='octicons' size={120}/>
            <Text text50 textC1 marginT-36>Thank you for contacting us!</Text>
            <Text textC2 text70R marginT-16>We will contact you within 48hrs.</Text>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1 centerH>
            
            {next?footer:
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={350}/>}/>}
        </View>

    );

};