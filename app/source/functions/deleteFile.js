import { ref, deleteObject } from 'firebase/storage';

export const deleteFile = async(url) => {
    const storage = require('../hooks/useData').storage;
    try{
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
    }catch{}
};