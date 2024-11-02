import Toast from "react-native-toast-message";
import { sendNotification } from "../../functions";
import { auth, db, pushListeners } from "../../hooks";
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";

export const getMyPost = async(setArray1, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('by', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const LastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(LastVisible);
            setArray1(snap.docs.map((post) => {
                const data = post.data();
                addToLikeArr(post.id, true, data.likes, data.comments);
                return { 
                    id: post.id, 
                    by: data.by, 
                    name: data.name, 
                    dp: auth.currentUser.photoURL, 
                    scontent: data.scontent, 
                    lastComment: data.lastComment, 
                    Public: data.public, 
                    token: data.token, 
                    verified: data.verified, 
                    timestamp: data.timestamp?.toDate(), 
                    ...data.text&&{ text: data.text }, 
                    ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                    ...data.imageUrl&&{ imageUrl: data.imageUrl }, 
                    ...data.vidUrl&&{ vidUrl: data.vidUrl }, 
                };
            }));
        });
        pushListeners(listener);
    }catch{}
};

export const getMyNextPost = async(setArray1, lastVisible, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('by', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((post) => {
            const data = post.data();
            addToLikeArr(post.id, true, data.likes, data.comments);
            return { 
                id: post.id, 
                by: data.by,
                name: data.name,
                dp: auth.currentUser.photoURL,
                scontent: data.scontent,
                lastComment: data.lastComment, 
                Public: data.public,
                token: data.token,
                verified: data.verified,
                timestamp: data.timestamp?.toDate(),
                ...data.text&&{ text: data.text },
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight },
                ...data.imageUrl&&{ imageUrl: data.imageUrl },
                ...data.vidUrl&&{ vidUrl: data.vidUrl },
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const fileForHelp = async(data) => {
    try{

        const props = {
            contact: data.contact,
            issue: data.issue,
            timestamp: serverTimestamp(),
            name: auth.currentUser.displayName,
            uid: auth.currentUser.uid, 
        };

        const docRef = collection(db, 'support');
        await addDoc(docRef, props);

        const message = `Thank you for contacting Wytty support. We will contact with you within 48hrs.`;
        sendNotification(false, true, false, auth.currentUser.uid, null, null, message, 'support', '', '', null);
    }catch{}
};

export const requestForVerification = async() => {
    try{

        Toast.show({ text1: 'Requested for verification' });

        const data = {
            username: auth.currentUser.displayName,
            timestamp: serverTimestamp(),
        };

        const userData = {
            requestedForVerification: true,
        };

        const userDocRef = doc(db, 'user', auth.currentUser.uid);
        const docRef = doc(db, 'verification', auth.currentUser.uid);
        updateDoc(userDocRef, userData);
        await updateDoc(docRef, data);

    }catch{}
};