import { ref, getDownloadURL } from 'firebase/storage';

export const getImageUrl = async(path) => {
    try{
        const cs = require('../hooks/useData');
        const storageRef = ref(cs.storage, path);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }catch{
        return 'https://shorturl.at/PQTW4';
    }
};