import React from 'react';
import { auth, db } from '../../hooks';
import Toast from 'react-native-toast-message';
import { Back, Input, Loader } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, Text, Colors, Button } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function DeleteAccount() {

    const navigation = useNavigation();

    const passwdRef = React.useRef('');

    const [index, setIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const getAccountState = React.useCallback(async() => {
        const docRef = doc(db, 'delete_request', auth.currentUser.uid);
        const ref = await getDoc(docRef);
        if(ref.exists()) setIndex(1);
        else setIndex(2);
    }, [setIndex]);

    const reqDelete = async() => {

        const data = {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            name: auth.currentUser.displayName,
            timestamp: serverTimestamp(),
        };

        setLoading(state => !state);

        await signInWithEmailAndPassword(auth, auth.currentUser.email, passwdRef.current).then(async() => {

            const docRef = doc(db, 'delete_request', auth.currentUser.uid);

            await setDoc(docRef, data).then(() => {
                Toast.show({ text1: 'Submitted for deletion' });
                setIndex(1);
            }).catch(() => {
                Toast.show({ text1: 'Error' });
            });

        }).catch((e) => {
            const ErrCode = e.code;
            if(ErrCode === 'auth/wrong-password') Toast.show({ text1: 'Wrong password' });
            else if(ErrCode === 'auth/user-disabled') Toast.show({ text1: 'Account disabled' });
            else if(ErrCode === 'auth/user-not-found') Toast.show({ text1: 'Account not found' });
            else Toast.show({ text1: 'Cannot process your request' });
        });

        setLoading(state => !state);

    };

    const Reactivate = async() => {
        setLoading(state => !state);
        const docRef = doc(db, 'delete_request', auth.currentUser.uid);
        await deleteDoc(docRef).then(() => {
            setIndex(2);
            Toast.show({ text1: 'Account reactivated 🎉' });
        }).catch(() => {
            Toast.show({ text1: 'Error' });
        });
        setLoading(state => !state);
    };

    React.useEffect(() => {
        getAccountState();
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>Purge Account</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const screen1 = React.useMemo(() => (
        <View flex centerH>
            <View width={width} marginT-26 paddingH-22>
                <Text textC1 text60>Purge {auth.currentUser.displayName}</Text>
                <Text textC2 text80R marginT-6>Your account and your data's will be completely removed within a month. You can continue using account till deletion. Comeback here and reactivate if you change your mind later.</Text>
            </View>
            <Input marginT-16 placeholder='Password' secure onChange={e => passwdRef.current=e}/>
            { loading?
            <View marginT-36>
                <ActivityIndicator size='small' color={Colors.red}/>
            </View>
            :
            <Button
            borderRadius={15}
            onPress={reqDelete}
            labelStyle={{ fontWeight: 'bold' }}
            style={{ width: width*0.89, height: 50 }}
              bg-red white text70 marginT-16
            label='Request to purge my account'/> }
            <Pressable onPress={() => navigation.navigate('ContactUs')}>
                <Text textC2 text70R marginT-26>Tell us why you're going?</Text>
                <Text textC2 text80R>Providing feedback will help us to make this app better</Text>
            </Pressable>
        </View>
    ));

    const screen2 = React.useMemo(() => (
        <View flex center>
            <Text text30 textC1 style={{ fontWeight: 'bold' }}>Your{"\n"}Account{"\n"}is Submitted for{"\n"}Deletion</Text>
            { loading?
            <View marginT-36>
                <ActivityIndicator size='small' color={Colors.white}/>
            </View>
            :
            <Button
            onPress={Reactivate}
            labelStyle={{ fontWeight: 'bold' }}
            style={{ width: width*0.7, height: 50 }}
            bg-primary white text70 marginT-16
            label='Reactivate my account'/> }
        </View>
    ));

    return (

        <View flex bg-bg1 useSafeArea center>
            {index===0?<Loader/>:null}
            {index===1?screen2:null}
            {index===2?screen1:null}
        </View>

    );

};