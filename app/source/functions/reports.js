import Toast from 'react-native-toast-message';
import { sendNotification } from './sendNotification';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const reportFunc = async(path, customUid) => {

    const fs = require('../hooks/useData');

    if(!customUid) Toast.show({ text1: 'Report submitted for manual review' });

    const uid = customUid?customUid:fs.auth.currentUser.uid;
    const msg = "We recieved your report";
    const route = 'Report';

    const data = {
        reporterId: uid, //reporting person id
        path: path, //path to document
        timestamp: serverTimestamp(),
    };

    try{
        const reportCollection = collection(fs.db, 'report');
        await addDoc(reportCollection, data);
        if(customUid) return;
        await sendNotification(true, true, false, uid, null, "Wytty", msg, route, null, null, null);
    }catch{}
}