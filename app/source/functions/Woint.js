import Toast from 'react-native-toast-message';
import { doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";

export const claimWoint = async(i) => {
    try{

        const fs = require('../hooks/useData');

        if(i>0){
            Toast.show({ text1: i, type: 'woint', visibilityTime: 5000 });
        }

        const data = {
            lastClaimed: serverTimestamp(),
            woint: increment(i),
        };

        const docRef = doc(fs.db, 'user', fs.auth.currentUser.uid);
        await updateDoc(docRef, data);

    }catch{}
};