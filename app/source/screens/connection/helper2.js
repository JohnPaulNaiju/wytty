import { getRoomId } from "./helper";
import { auth, db } from "../../hooks";
import { getDp } from "../../functions";
import Toast from "react-native-toast-message";
import { collection, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export const getRecieved = async(setUsers, setLastVisible, Limit) => {
    try{
        const userDocRef = doc(db, 'user', auth.currentUser.uid);
        const requestRef = collection(userDocRef, 'request_r');
        const Query = query(requestRef, orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setUsers(await Promise.all(docRef.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                name: data.name,
                dp: await getDp(snap.id),
                connected: false,
            };
        })));
    }catch{}
};

export const getNextRecieved = async(setUsers, lastVisible, setLastVisible, Limit) => {
    try{
        const userDocRef = doc(db, 'user', auth.currentUser.uid);
        const requestRef = collection(userDocRef, 'request_r');
        const Query = query(requestRef, orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(docRef.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                name: data.name,
                dp: await getDp(snap.id),
                connected: false,
            };
        }));
        setUsers(old => [...old, ...newData]);
    }catch{}
};

export const getSend = async(setUsers, setLastVisible, Limit) => {
    try{
        const userDocRef = doc(db, 'user', auth.currentUser.uid);
        const requestRef = collection(userDocRef, 'request_send');
        const Query = query(requestRef, orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setUsers(await Promise.all(docRef.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                name: data.name,
                dp: await getDp(snap.id),
            };
        })));
    }catch{}
};

export const getNextSend = async(setUsers, lastVisible, setLastVisible, Limit) => {
    try{
        const userDocRef = doc(db, 'user', auth.currentUser.uid);
        const requestRef = collection(userDocRef, 'request_send');
        const Query = query(requestRef, orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(docRef.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                name: data.name,
                dp: await getDp(snap.id),
            };
        }));
        setUsers(old => [...old, ...newData]);
    }catch{}
};

export const searchConversation = async(searchTerm, uids, setUsers, Limit, handleChange) => {
    try{
        const Query = query(collection(db, 'user'), where('uid', 'in', uids), where('username', '>=', searchTerm), where('username', '<=', searchTerm+'\uf8ff'), orderBy('username'), limit(Limit));
        const docRef = await getDocs(Query);
        if(docRef.empty){
            handleChange({ loading: false });
            Toast.show({ text1: 'No results found' });
            return;
        }
        handleChange({ loading: false });
        setUsers(docRef.docs.map((chat) => {
            const data = chat.data();
            return {
                roomId: getRoomId(chat.id),
                recipientId: chat.id,
                name: data.username,
                notification: true,
                myNotification: true,
                dp: data.dplink,
            };
        }));
    }catch{}
};