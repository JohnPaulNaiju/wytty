import React from 'react';
import { useData } from '../hooks';
import UserScreens from './UserScreens';
import AuthScreens from './AuthScreens';
import { toastConfig } from './ToastConfig';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';

const linking = {
    prefixes: ['https://wytty.org', 'wytty://'],
    config: {
        screens: {
            CreateTribe: {
                path: "tribe/:index/:tribeId",
            },
            LogUp: {
                path: "invite/"
            },
            NoteView: {
                path: "note/:id"
            },
            PostView: {
                path: "post/:id"
            },
            OthersProfile: {
                path: "profile/:id"
            },
        }
    }
};

const AppTheme = {
    dark: true,
    colors: {
        background: '#0F0F0F',
        border: '#0F0F0F',
        card: '#0F0F0F',
        primary: '#027DFD',
        text: '#FFFFFF',
        notification: '#FFFFFF'
    }
};

export default () => {

    const { user } = useData();

    const toastview = React.useMemo(() => (
        <Toast 
        type='default' 
        position='bottom' 
        autoHide 
        topOffset={0}
        visibilityTime={3500} 
        bottomOffset={100} 
        keyboardOffset={100} 
        config={toastConfig}/>
    ));

    if(user===null) return null;

    return (

        <React.Fragment>
            <StatusBar animated translucent style="light" backgroundColor='#0F0F0F' networkActivityIndicatorVisible/>
            <NavigationContainer theme={AppTheme} linking={linking}>
                { user ? <UserScreens/> : <AuthScreens/> }
            </NavigationContainer>
            {toastview}
        </React.Fragment>

    );

};