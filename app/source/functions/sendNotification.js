import { doc, getDoc, collection, addDoc, arrayUnion, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';

const BASE_URL = 'https://exp.host/--/api/v2/push/send';

const sendFCMNotification = async(userId, token, title, message) => {
    const fs = require('../hooks/useData');
    try{
        const fcmTokens = [];
        if(token) token?.map(obj => fcmTokens.push(obj));
        else{ 
            const userDocRef = doc(fs.db, 'user', userId);
            const userDoc = await getDoc(userDocRef);
            const userToken = userDoc.data().token;
            userToken?.map(obj => fcmTokens.push(obj));
        }
        if(fcmTokens.length===0) return;
        const tokens = fcmTokens.length===1?fcmTokens[0]:fcmTokens.filter(Boolean).map(obj => obj);
        const msg = {
            to: tokens,
            title: title || 'Wytty',
            body: message,
            sound: 'default'
        };
        await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(msg),
        });
    }catch{}
};

const sendActivity = async(userId, message, route, params, image) => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            for: arrayUnion(...[userId]),
            message: message,
            timestamp: serverTimestamp(),
            route: route,
            ...params&&{ params: {...params} },
            ...image&&{ image: image },
        };

        const collectionRef = collection(fs.db, 'notification');

        await addDoc(collectionRef, data);
    }catch{}
};

const sendPostActivity = async(userId, message, route, params, image, func) => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            for: arrayUnion(...[userId]),
            message: message,
            timestamp: serverTimestamp(),
            route: route,
            ...params&&{ params: {...params} },
            ...image&&{ image: arrayUnion(...[image]) },
            func: func,
        };

        const docId = `post${params.id}${func}`;
        const docRef = doc(fs.db, 'notification', docId);

        await updateDoc(docRef, data).catch(() => {
            setDoc(docRef, data);
        });
    }catch{}
};

export const sendNotification = async(pn, a, pa, userId, token, title, message, route, params, image, func) => {
    try{
        const Route = route?route:'default';
        if(pn) sendFCMNotification(userId, token, title, message);
        if(a) sendActivity(userId, message, Route, params, image);
        if(pa) sendPostActivity(userId, message, Route, params, image, func);
    }catch{}
};

//pn: push notification
//a: activity
//pa: post activity

//sendNotification(pn, a, pa, userId, token, title, message, route, params, image, func);