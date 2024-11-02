import { setStringAsync } from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export const copyText = async(text) => {
    await setStringAsync(text);
    Toast.show({ text1: 'Copied!' });
};