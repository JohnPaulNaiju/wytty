import { auth, db } from "../../../hooks";
import { sendNotification, getDp } from "../../../functions";
import { arrayRemove, deleteDoc, doc, increment, query, updateDoc, collection, orderBy, limit, getDocs, startAfter, where } from "firebase/firestore";

export const deleteTribe = async(roomId) => {
    try{

        const userData = {
            tribe: increment(-1),
        };

        const userRef = doc(db, 'user', auth.currentUser.uid);
        const tribeRef = doc(db, 'tribe', roomId);

        updateDoc(userRef, userData);
        await deleteDoc(tribeRef);
    }catch{}
};

export const leaveTribe = async(roomId) => {
    try{

        const tribeData = {
            member: arrayRemove(...[auth.currentUser.uid]),
            population: increment(-1),
        };

        const userData = {
            tribe: increment(-1),
            tribeId: arrayRemove(...[roomId]),
        };

        const userRef = doc(db, 'user', auth.currentUser.uid);
        const tribeRef = doc(db, 'tribe', roomId);
        const memberRef = doc(db, 'tribe', roomId, 'member', auth.currentUser.uid);
    
        updateDoc(userRef, userData);
        deleteDoc(memberRef);
        await updateDoc(tribeRef, tribeData);
    }catch{}
};

export const getMembers = async(roomId, setArray1, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'member'), orderBy('joined', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setArray1(await Promise.all(docRef.docs.map(async(user) => {
            const data = user.data();
            return {
                id: user.id,
                name: data.name,
                joined: data.joined?.toDate(),
                dp: await getDp(user.id),
                owner: data.owner,
                admin: data.meAdmin,
            };
        })));
    }catch{}
};

export const getNextMembers = async(roomId, setArray1, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'member'), orderBy('joined', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(docRef.docs.map(async(user) => {
            const data = user.data();
            return {
                id: user.id,
                name: data.name,
                joined: data.joined?.toDate(),
                dp: await getDp(user.id),
                owner: data.owner,
                admin: data.meAdmin,
            };
        }));
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const getMedia = async(roomId, setArray1, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('element', '==', 'image'), orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setArray1(docRef.docs.map((user) => {
            const data = user.data();
            return {
                id: user.id,
                url: data.imageUrl,
                me: data.by===auth.currentUser.uid,
                name: data.name,
                scontent: data.scontent,
            };
        }));
    }catch{}
};

export const getNextMedia = async(roomId, setArray1, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('element', '==', 'image'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((media) => {
            const data = media.data();
            return {
                id: media.id,
                url: data.imageUrl,
                me: data.by===auth.currentUser.uid,
                name: data.name,
                scontent: data.scontent,
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const makeAdmin = async(roomId, userId, message, name) => {
    try{

        const img = 'https://shorturl.at/fluV6';
        const route = 'default';
        const title = name?name:"Wytty";

        const data = {
            meAdmin: true,
        };

        const memberRef = doc(db, 'tribe', roomId, 'member', userId);
        await updateDoc(memberRef, data);
        sendNotification(true, true, false, userId, null, title, message, route, null, img, null);
    }catch{}
};

export const DismissAdmin = async(roomId, userId) => {
    try{

        const data = {
            meAdmin: false,
        };

        const memberRef = doc(db, 'tribe', roomId, 'member', userId);
        await updateDoc(memberRef, data);
    }catch{}
};