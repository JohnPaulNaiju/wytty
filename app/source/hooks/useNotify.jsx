import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { auth, db, useData } from './useData';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { connectionNotify, notificationNotify, requestsNotify } from './helper';
import { setNotificationHandler, setNotificationChannelAsync, AndroidImportance, getPermissionsAsync, requestPermissionsAsync, getExpoPushTokenAsync } from 'expo-notifications';

const isAndroid = Platform.OS==='android';

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const registerForPushNotificationsAsync = async() => {
    let token;
    if(isAndroid){
        await setNotificationChannelAsync('default',{
            name: 'default',
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FFFFFF',
        });
    }
    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if(existingStatus!=='granted'){
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
    }
    if(finalStatus!=='granted') return null;
    token = (await getExpoPushTokenAsync({ 
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    })).data;
    return token;
};

export const updateToken = async(token, register) => {
    try{

        const data = {
            token: register?arrayUnion(...[token]):arrayRemove(...[token])
        };

        const userRef = doc(db, 'user', auth.currentUser.uid);

        await updateDoc(userRef, data);
    }catch{
        const { show } = require('react-native-toast-message').default;
        show({ text1: 'Cannot register for notification' });
    }
};

export const reqNotification = async(register) => {
    const token = await registerForPushNotificationsAsync();
    updateToken(token, register);
    return token;
};

export const NotifyContext = React.createContext({});

export const NotifyProvider = ({ children }) => {

    const { user, profile } = useData();

    const [notify, setNotify] = React.useState({
        tribe: 0,
        msg: false,
        activity: false,
        request: false,
    });

    const handleNotify = React.useCallback((value) => {
        setNotify((state) => ({ ...state, ...value }));
    }, [setNotify]);

    React.useEffect(() => {
        if(user){
            connectionNotify(handleNotify);
            notificationNotify(handleNotify, profile?.lastChanged?.toDate());
            requestsNotify(handleNotify);
            reqNotification(true);
        }
    }, [user]);

    const contextValue = { notify, handleNotify };

    return (

        <NotifyContext.Provider value={contextValue}>
            {children}
        </NotifyContext.Provider>

    );

};

export const useNotify = () => React.useContext(NotifyContext);