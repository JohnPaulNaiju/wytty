import { pushListeners } from './Listener';
import { collection, where, orderBy, limit, query, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export const connectionNotify = (handleNotify) => {
    const fs = require('./useData');
    try{
        const docRef = collection(fs.db, 'messaging');
        const Query = query(docRef, where('member', 'array-contains', fs.auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(1));
        const listener = onSnapshot(Query, (snap) => {
            if(!snap.empty){
                snap.docs.map((Doc) => {
                    const data = Doc.data();
                    if(!data.seen&&data.lastmessageby!==fs.auth.currentUser.uid) handleNotify({ msg: true });
                });
            }
        });
        pushListeners(listener);
    }catch{}
};

export const requestsNotify = (handleNotify) => {
    const fs = require('./useData');
    try{
        const userDocRef = doc(fs.db, 'user', fs.auth.currentUser.uid);
        const requestRef = collection(userDocRef, 'request_r');
        const Query = query(requestRef, orderBy('timestamp', 'desc'), limit(1));
        const listener = onSnapshot(Query, (snap) => {
            if(!snap.empty) handleNotify({ msg: true, request: true });
        });
        pushListeners(listener);
    }catch{}
};

export const updateNotify = async() => {
    const fs = require('./useData');
    try{

        const data = {
            lastChanged: serverTimestamp(),
        };

        const userDocRef = doc(fs.db, 'user', fs.auth.currentUser.uid);

        await updateDoc(userDocRef, data);
    }catch{}
};

export const notificationNotify = (handleNotify, lastChanged) => {
    const fs = require('./useData');
    try{
        const docRef = collection(fs.db, 'notification');
        const Query = query(docRef, where('for', 'array-contains', fs.auth.currentUser.uid), orderBy('timestamp'), limit(1));
        const listener = onSnapshot(Query, (snap) => {
            if(!snap.empty){
                const timestamp = snap.docs[0].data().timestamp?.toDate();
                if(timestamp>lastChanged) handleNotify({ activity: true });
                else handleNotify({ activity: false });
            }
        });
        pushListeners(listener);
    }catch{}
};

export const getProfileData = (setProfile) => {
    const fs = require('./useData');
    try{
        const userRef = doc(fs.db, 'user', fs.auth.currentUser.uid);
        const listener = onSnapshot(userRef, (snap) => {
            const data = snap.data();
            setProfile(data);
        });
        pushListeners(listener);
    }catch{}
};