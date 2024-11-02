import { auth, db } from "../../../hooks";
import Toast from "react-native-toast-message";
import { detectSpamMessage, removeStopWords, sendNotification } from '../../../functions';
import { addDoc, collection, deleteDoc, doc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';

export const getAdminMsg = async(roomId, setArray1, unsubscribe, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'admin'), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setArray1(snap.docs.map((msg) => {
                const data = msg.data();
                return {
                    id: msg.id,
                    by: data.by,
                    name: data.name,
                    element: data.element,
                    timestamp: data.timestamp?.toDate(),
                    ...data.noteId&&{ noteId: data.noteId },
                    ...data.element==='text' && { message: data.message },
                    ...data.element==='note' && {
                        noteId: data.noteId,
                        title: data.title,
                        category: data.category,
                        message: data.message,
                    },
                    ...data.element==='request'&&{
                        dp: data.dp,
                        status: data.status,
                    }
                };
            }));
        });
        unsubscribe.push(listener);
    }catch{}
};

export const getNextAdminMsg = async(roomId, setArray1, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'admin'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((msg) => {
            const data = msg.data();
            return {
                id: msg.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.noteId&&{ noteId: data.noteId },
                ...data.element==='text' && { message: data.message },
                ...data.element==='note' && {
                    noteId: data.noteId,
                    title: data.title,
                    category: data.category,
                    message: data.message,
                },
                ...data.element==='request'&&{
                    dp: data.dp,
                    status: data.status,
                }
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const saveAdminMsg = async(roomId, msg, element) => {
    try{

        detectSpamMessage();

        const data = {
            by: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            element: element,
            timestamp: serverTimestamp(),
            ...element==='text' && { 
                message: msg, 
                searchTerm: removeStopWords(msg), 
            }, 
        };

        const data2 = {
            admin: increment(1),
            timestamp: serverTimestamp(),
        };

        const msgRef = collection(db, 'tribe', roomId, 'admin');
        const tribeRef = doc(db, 'tribe', roomId);
        await addDoc(msgRef, data);
        updateDoc(tribeRef, data2);
    }catch{}
};

export const delMsg = async(roomId, msgId) => {
    try{
        const docRef = doc(db, 'tribe', roomId, 'admin', msgId);
        await deleteDoc(docRef);
    }catch{}
};

export const rejectRequest = async(roomId, msgId) => {
    try{

        const msgData = {
            status: 'rejected',
            rejectedBy: {
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            }
        };

        const msgRef = doc(db, 'tribe', roomId, 'admin', msgId);
        await updateDoc(msgRef, msgData);
    }catch{}
};

export const acceptRequest = async(roomId, userId, username, msgId, tLimit) => {
    try{

        
        const tribeData = {
            population: increment(1),
            member: arrayUnion(...[userId]),
        };

        const memberData = {
            name: username,
            owner: false,
            meAdmin: false,
            msg: 0,
            admin: 0,
            post: 0,
            poll: 0,
            file: 0,
            mention: 0,
            joined: serverTimestamp(),
        };

        const userData = {
            tribe: increment(1),
            tribeId: arrayUnion(...[roomId]),
        };

        const msgData = {
            status: 'accepted',
        };

        const tribeDocRef = doc(db, 'tribe', roomId);
        const memberDocRef = doc(db, 'tribe', roomId, 'member', userId);
        const userDocRef = doc(db, 'user', userId);
        const msgRef = doc(db, 'tribe', roomId, 'admin', msgId);

        const userDoc = await getDoc(userDocRef);
        const tribeNum = userDoc.data()?.tribe;
        if(tribeNum>=tLimit){
            rejectRequest(roomId, msgId);
            Toast.show({ text1: `${username} reached tribe limit` });
            return;
        }

        updateDoc(msgRef, msgData);
        setDoc(memberDocRef, memberData);
        updateDoc(userDocRef, userData);
        await updateDoc(tribeDocRef, tribeData);

        const msg = 'Your request to join tribe was accepted';
        const img = 'https://shorturl.at/blvz2';

        sendNotification(true, true, false, userId, null, username, msg, null, null, img, null);
    }catch{}
};