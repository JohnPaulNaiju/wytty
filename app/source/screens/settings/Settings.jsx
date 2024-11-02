import React from 'react';
import Tools from './Tools';
import { openLink } from '../../functions';
import Toast from 'react-native-toast-message';
import { Dimensions, Share } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ListItemWithIcon, Alert } from '../../components';
import { View, Text, Colors, Switch } from 'react-native-ui-lib';
import { auth, reqNotification, registerForPushNotificationsAsync } from '../../hooks';

const { width } = Dimensions.get('window');

const Settings = ({profile}) => {

    const navigation = useNavigation();

    const [index, setIndex] = React.useState(0);
    const [notification, setNotification] = React.useState(false);

    const invite = () => {
        Share.share({
            title: 'Wყƚƚყ | Find your tribe, Join the conversion',
            message: 'Hey! Join Wყƚƚყ! A community based social networking platform and space to connect, share and collaborate with people who share your interests. \nhttps://wytty.org/invite/',
            url: `https://wytty.org/invite/`
        });
    };

    const handleChange = React.useCallback(async(e) => {
        reqNotification(e);
        setNotification(e);
    }, [setNotification]);

    const open = (val) => {
        setTimeout(() => {
            setIndex(val);
        }, 100);
    };

    const close = () => {
        setTimeout(() => {
            setIndex(0);
        }, 100);
    };

    const initFunc = async() => {
        if(profile?.token===null) return;
        const token = await registerForPushNotificationsAsync();
        for(let i = 0; i < profile?.token?.length; i++){
            if(profile?.token[i]===token){
                setNotification(true);
                break;
            }
        }
    };

    React.useEffect(() => {
        initFunc();
    }, [profile?.token]);

    const alerts = React.useMemo(() => (
        <React.Fragment>
            <Alert 
            open={index===1}
            close={close}
            title='Sign Out'
            subtitle='Are you sure you want to sign out'
            showCancel
            options={[
                {
                    text: 'Sign Out',
                    color: Colors.red,
                    onPress: () => {
                        auth.signOut().catch(() => {
                            Toast.show({ text1: 'Error signing out' });
                        });
                    }
                }
            ]}/>
            <Alert 
            open={index===2}
            close={close}
            title='Change Password' 
            subtitle='Send email to reset password' 
            showCancel
            options={[
                {
                    text: 'Send',
                    color: Colors.primary,
                    onPress: () => {
                        sendPasswordResetEmail(auth, auth.currentUser.email).then(() => {
                            Toast.show({ text1: 'Email sent' });
                        }).catch(() => {
                            Toast.show({ text1: 'Error sending email' });
                        })
                    }
                }
            ]}/>
        </React.Fragment>
    ));

    return (

        <View width={width}>
            <Tools/>
            <Text text70 textC1 marginT-16 marginL-16 style={{ fontWeight: 'bold' }}>Settings</Text>
            <ListItemWithIcon 
            title='Notifications' 
            subtitle='Turn on your notification' 
            icon='bell' type='feather'
            right={<Switch onColor={Colors.primary} value={notification} onValueChange={handleChange}/>}/>
            <ListItemWithIcon 
            title='Change password' 
            icon='form-textbox-password' 
            type='material-community' 
            subtitle='Send email to reset password'
            onPress={() => open(2)}/>
            <ListItemWithIcon 
            title="Beginner's guide"
            icon='auto-stories' 
            subtitle='Short and simple guide on how to use Wყƚƚყ'
            onPress={() => navigation.navigate('How')}/>
            <ListItemWithIcon 
            title='Contacts Us' 
            icon='old-phone' 
            type='entypo' 
            subtitle='Contact Wყƚƚყ Support for help, send feedback or report issues'
            onPress={() => navigation.navigate('ContactUs')}/>
            <ListItemWithIcon 
            title='Community guidelines' 
            icon='book-open' 
            type='feather'
            subtitle='Guidelines to be followed'
            onPress={() => openLink('wytty.org/#/community-guidelines')}/>
            <ListItemWithIcon 
            title='Privacy policy' 
            icon='policy' 
            subtitle='How we use your data'
            onPress={() => openLink('wytty.org/#/privacy-policy')}/>
            <ListItemWithIcon 
            title='Terms and conditions' 
            icon='gavel' 
            subtitle='Terms and conditions to be followed'
            onPress={() => openLink('wytty.org/#/terms')}/>
            {profile?.verified?null:
            <ListItemWithIcon 
            title='Become a Creator' 
            icon='verified' 
            subtitle='Request for account verification'
            onPress={() => navigation.navigate('Verification')}/>}
            <ListItemWithIcon 
            title='Invite a friend' 
            icon='user-friends' 
            type='font-awesome' 
            subtitle='Invite your friends to Wytty'
            onPress={invite}/>
            <ListItemWithIcon 
            title='Sign out' 
            icon='logout' 
            type='material-community' 
            subtitle={`Sign out ${auth.currentUser.displayName}`}
            onPress={() => open(1)}/>
            <ListItemWithIcon 
            title='Purge account' 
            icon='delete-forever' 
            type='material-community' 
            color={Colors.red} 
            subtitle='Request to purge your account'
            onPress={() => navigation.navigate('DeleteAccount')}/>
            <View width={width} marginB-26 paddingL-36>
                <Text textC1 text60 marginT-16>Wყttყ</Text>
                <Text textC2 text70L>Version 1.0.23</Text>
                <Text textC2 text80R>© 2023 Wytty Platforms</Text>
            </View>
            {alerts}
        </View>

    );

};

export default React.memo(Settings);