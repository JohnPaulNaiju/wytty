import React from 'react';
import { firebaseConfig } from './config';
import { getStorage } from "firebase/storage";
import { hideAsync } from 'expo-splash-screen';
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { initializeApp, getApps, getApp } from "firebase/app";
import { addEventListener } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, initializeAuth, getReactNativePersistence } from "firebase/auth";

const loadInitials = () => {

    const { Colors } = require('react-native-ui-lib');
    const theme = require('./theme').default;
    const { register } = require('@expo/timeago.js');
    const { LocaleFunc } = require('../functions');

    Colors.loadSchemes(theme);
    Colors.setScheme('dark');
    register('my-locale', LocaleFunc);

};

const Footer = () => {

    const { View, Text } = require('react-native-ui-lib');

    return (

        <View useSafeArea center width='100%' height={60}>
            <Text textC1 text90R marginT-2>No internet connection</Text>
        </View>

    );

};

let app;

if(getApps().length===0) app = initializeApp(firebaseConfig);
else app = getApp();

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export const DataContext = React.createContext({});

export const DataProvider = ({ children }) => {

    const [user, setUser] = React.useState(null);
    const [profile, setProfile] = React.useState(null);
    const [offline, setOffline] = React.useState(false);

    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            hideAsync();
            if(user){ 
                setUser(true);
                const { getProfileData } = require('./helper');
                getProfileData(setProfile);
            }else{ 
                setUser(false);
                const { clearSubscriptions } = require('./Listener');
                clearSubscriptions();
            }
        });
    }, []);

    React.useEffect(() => {
        loadInitials();
        const unsubscribe = addEventListener(state => {
            setOffline(!state.isInternetReachable);
        });
        return () => unsubscribe();
    }, []);

    const contextValue = { user, profile, offline };

    return (

        <DataContext.Provider value={contextValue}>
            {children}
            {offline?<Footer/>:null}
        </DataContext.Provider>

    );

};

export const useData = () => React.useContext(DataContext);