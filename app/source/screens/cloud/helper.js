import { deleteFile } from '../../functions';
import Toast from 'react-native-toast-message';
import { auth, db, pushListeners } from "../../hooks";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, increment, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';

export const getFolders = (setArray1, Limit) => {
    try{
        const Query = query(collection(db, 'user', auth.currentUser.uid, 'folder'), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            setArray1(snap.docs.map((folder) => {
                const data = folder.data();
                return {
                    id: folder.id,
                    name: data.name,
                    items: data.items,
                    size: data.size,
                    timestamp: data.timestamp?.toDate(),
                };
            }));
        });
        pushListeners(listener);
    }catch{}
};

export const createNewFolder = async(name) => {
    try{
        const data = {
            name: name?.trim(),
            items: 0,
            size: 0,
            timestamp: serverTimestamp(),
        };
        const docRef = collection(db, 'user', auth.currentUser.uid, 'folder');
        await addDoc(docRef, data);
    }catch{}
};

export const checkCanUpload = (size, used, storage) => {
    try{
        if(size>storage){
            Toast.show({ text1: `Cannot upload files larger than ${Math.round(storage/1000)||1} GB` });
            return false;
        }else if(used>=storage){
            Toast.show({ text1: `You have used ${Math.round(storage/1000)||1} GB of cloud storage` });
        }else if((size+used)>storage){
            Toast.show({ text1: `Your limit is ${Math.round(storage/1000)||1} GB` });
            return false;
        }else return true;
    }catch{
        return false;
    }
};

export const updateFolder = async(folderId, name, mime, size, url) => {
    try{
        const roundsize = Math.round(size?.toFixed(2)) || 0;

        const file = [
            {
                name: name?name:'file',
                mime: mime?mime:null,
                size: size?roundsize:0,
                url: url?url:null,
            }
        ];

        const data = {
            items: increment(1),
            size: increment(roundsize),
            lastChanged: serverTimestamp(),
            files: arrayUnion(...file),
        };

        const userData = {
            storageused: increment(roundsize),
        };

        const docRef = doc(db, 'user', auth.currentUser.uid, 'folder', folderId);
        const userRef = doc(db, 'user', auth.currentUser.uid);
        updateDoc(userRef, userData);
        await updateDoc(docRef, data);
    }catch{
        Toast.show({ text1: 'Oops! Folder capacity might be full' });
    }
};

export const getFiles = async(folderId, setFiles, unsubscribe) => {
    try{
        const docRef = doc(db, 'user', auth.currentUser.uid, 'folder', folderId);
        const listener = onSnapshot(docRef, (snap) => {
            const files = snap.data()?.files || [];
            setFiles(files);
        });
        unsubscribe.push(listener);
    }catch{}
};

export const deleteUserFile = async(folderId, item) => {
    try{

        const data = {
            files: arrayRemove(...[item]),
            items: increment(-1),
            size: increment(-item.size),
        };

        const userData = {
            storageused: increment(-item.size),
        };

        const docRef = doc(db, 'user', auth.currentUser.uid, 'folder', folderId);
        const userRef = doc(db, 'user', auth.currentUser.uid);

        deleteFile(item.url);

        await updateDoc(docRef, data);
        await updateDoc(userRef, userData);

    }catch{}
};

export const deleteFolder = async(folderId) => {
    try{
        const docRef = doc(db, 'user', auth.currentUser.uid, 'folder', folderId);
        await deleteDoc(docRef);
    }catch{}
};