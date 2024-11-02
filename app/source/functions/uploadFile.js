import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const isAndroid = Platform.OS==='android';

//metadata types:
//1) 'video/webm'
//2) 'image/webp'

export const uploadFile = async (uri, path, type) => {
    try {

        const uploadURI = isAndroid?uri:uri?.replace('file://','');

        const storage = require('../hooks/useData').storage;

        const metadata = {
            contentType: type,
        };

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = () => {
                Toast.show({ text1: 'Network request failed' });
                reject();
            };
            xhr.responseType = "blob";
            xhr.open("GET", uploadURI, true);
            xhr.send(null);
        });

        const storageRef = ref(storage, path);

        await uploadBytes(storageRef, blob, metadata);
        blob.close();

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }catch{
        return null;
    }
};
