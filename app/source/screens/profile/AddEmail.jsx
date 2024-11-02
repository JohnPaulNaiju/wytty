import React from 'react';
import { useData } from '../../hooks';
import { saveNewEmail } from './helper';
import { regex } from '../../functions';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { Back, Input, Loader } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors, Button } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

export default function AddEmail() {

    const navigation = useNavigation();
    const { profile } = useData();

    const { email } = regex;

    const [Email, setEmail] = React.useState(profile?.email?profile?.email:'');
    const [isValid, setIsValid] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const addBackUpEmail = async(emailaddress) => {
        setLoading(state => !state);
        const result = await saveNewEmail(emailaddress);
        if(result){
            Toast.show({ text1: '🎉 Back-up email registered' });
            navigation.goBack();
            return;
        }
        setLoading(state => !state);
    }

    React.useEffect(() => {
        setIsValid(email.test(Email));
    }, [Email, setIsValid]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>Add back-up email</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null
        });
    }, [navigation]);

    return (

        <View flex useSafeArea bg-bg1 centerH>
            
            <Input
            len={320}
            marginT-26
            placeholder="Email address"
            val={Email}
            valid={(isValid)}
            notValid={(!isValid)}
            onChange={ e => setEmail(e) }/>
            { loading?
            <View marginT-26 center height={50}>
                <Loader size={50}/>
            </View>:
            <Button 
            label='Register back-up email'
            borderRadius={15}
            onPress={() => addBackUpEmail(Email)}
            bg-primary white text70 marginT-26
            labelStyle={{ fontWeight: "bold" }}
            style={{ width: width*0.9, height: 50 }}
            disabled={!isValid}/>}
        </View>

    );

};