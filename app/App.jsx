import React from 'react';
import 'react-native-gesture-handler';
import AppNavigation from './source/navigation/App';
import { MenuProvider } from 'react-native-popup-menu';
import { preventAutoHideAsync } from 'expo-splash-screen';
import { DataProvider, NotifyProvider, UploadProvider } from './source/hooks';

preventAutoHideAsync();

export default function App() {

    return (

        <DataProvider>
            <NotifyProvider>
                <UploadProvider>
                    <MenuProvider>
                        <AppNavigation/>
                    </MenuProvider>
                </UploadProvider>
            </NotifyProvider>
        </DataProvider>

    );

};