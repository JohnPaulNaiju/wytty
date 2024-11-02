import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';

export const openLink = async(link) => {
    try{
        let url;
        if(/^(f|ht)tps?:\/\//i.test(link)) url = link;
        else url = `https://${link}`;
        await WebBrowser.openBrowserAsync(url);
    }catch{
        try{
            Linking.openURL(url);
        }catch{
            Toast.show({ text1: 'Cannot open this url' });
        }
    }
};