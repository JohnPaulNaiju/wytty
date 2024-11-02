import React from 'react';
import { Dimensions } from 'react-native';
import { auth, useData } from '../../hooks';
import { Alert, Icon } from '../../components';
import Toast from 'react-native-toast-message';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const Header = () => {

    const navigation = useNavigation();

    const { profile } = useData();

    const [open, setOpen] = React.useState(false);

    const press = (num) => {
        if(num){
            sendEmailVerification(auth.currentUser).then(() => {
                setOpen(state => !state);
            }).catch(() => {
                Toast.show({ text1: 'Error sending email' });
            });
        }else navigation.navigate('EditProfile', { data: profile });
    };

    const alert = React.useMemo(() => (
        <Alert
        open={open}
        options={[
            {
                text: 'Ok',
                color: Colors.textC1,
                onPress: () => {}
            }
        ]}
        close={() => setOpen(state => !state)}
        title='Verification mail sent'
        subtitle={`Verification mail sent to ${auth.currentUser.email}`}/>
    ));

    const section1 = React.useMemo(() => (
        <TouchableOpacity onPress={() => press(false)}>
            <View bg-bg1 paddingH-16 paddingV-8 row centerV width={width}>
                <Icon name='mail' type='feather' size={36} color={Colors.primary}/>
                <Text textC1 text70M marginL-26>Add Back-up email</Text>
            </View>
        </TouchableOpacity>
    ));

    const section2 = React.useMemo(() => (
        <TouchableOpacity onPress={() => press(true)}>
            <View bg-bg1 paddingH-16 paddingV-12 row centerV width={width}>
                <Icon name='mail' type='feather' size={36} color={Colors.primary}/>
                <View marginL-26>
                    <Text textC1 text70M>Verify your email address</Text>
                    <Text textC1 text80R>{profile?.email}</Text>
                </View>
            </View>
        </TouchableOpacity>
    ));
    
    const section3 = React.useMemo(() => (
        <TouchableOpacity onPress={() => press(false)}>
            <View bg-bg1 paddingH-16 paddingV-8 row centerV width={width}>
                <Icon name='camera-account' type='material-community' size={36} color={Colors.primary}/>
                <Text textC1 text70M marginL-26>Add profile photo</Text>
            </View>
        </TouchableOpacity>
    ));

    const section4 = React.useMemo(() => (
        <TouchableOpacity onPress={() => press(false)}>
            <View bg-bg1 paddingH-16 paddingV-8 row centerV width={width}>
                <Icon name='card-account-details' type='material-community' size={36} color={Colors.primary}/>
                <Text textC1 text70M marginL-26>Add name and about</Text>
            </View>
        </TouchableOpacity>
    ));

    return (

        <View width={width} centerH>
            {profile?.email?null:section1}
            {(profile?.email&&!auth.currentUser.emailVerified)?section2:null}
            {profile?.dplink==='https://shorturl.at/PQTW4'?section3:null}
            {(profile?.name===null||profile?.bio===null)?section4:null}
            {alert}
        </View>

    );

};

export default React.memo(Header);