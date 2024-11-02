import React from 'react';
import { LogUp, LogIn, ForgotPassword, Welcome } from '../screens';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default () => {

    const screenOptions = {
        headerShadowVisible: false, 
        ...TransitionPresets.SlideFromRightIOS,
        headerStyle: {
            backgroundColor: '#0F0F0F'
        }
    };

    return (

        <Stack.Navigator initialRouteName='Welcome' screenOptions={screenOptions}>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false, gestureEnabled: false }}/>
            <Stack.Screen name="LogUp" component={LogUp} options={{ headerShown: false, gestureEnabled: true }}/>
            <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false, gestureEnabled: true }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        </Stack.Navigator>

    );

};