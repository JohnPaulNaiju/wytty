import { getDp } from "./getDp";
import Toast from "react-native-toast-message";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, startAfter, deleteDoc, doc, increment, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const postComment = async(id, comment) => {
    const fs = require('../hooks/useData');
    try{

        const commentData = {
            by: fs.auth.currentUser.uid,
            name: fs.auth.currentUser.displayName,
            timestamp: serverTimestamp(),
            message: comment?.trim(),
            for: id, //post Id
            likes: 0,
            replies: 0,
        };

        const commentRef = collection(fs.db, 'comment');

        const ref = await addDoc(commentRef, commentData);

        Toast.show({ text1: 'Your reply was posted 🎉' });
        return ref.id;
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
        return false;
    }
}

export const getComments = async(id, setComments, setLastVisible, Limit) => {
    const fs = require('../hooks/useData');
    try{
        const docRef = query(collection(fs.db, 'comment'), where('for', '==', id), orderBy('timestamp', 'desc'), limit(Limit));
        const ref = await getDocs(docRef);
        const lastVisible = ref.docs[ref.docs.length-1];
        setLastVisible(lastVisible);
        setComments(await Promise.all(ref.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                by: data.by,
                name: data.name,
                dp: await getDp(data.by),
                timestamp: data.timestamp?.toDate(),
                message: data.message,
                likes: data.likes,
                replies: data.replies,
                liked: data.liked?.includes(fs.auth.currentUser.uid),
            };
        })));
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
}

export const getMoreComments = async(id, setComments, lastVisible, setLastVisible, Limit) => {
    const fs = require('../hooks/useData');
    try{
        const docRef = query(collection(fs.db, 'comment'), where('for', '==', id), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const ref = await getDocs(docRef);
        const LastVisible = ref.docs[ref.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(ref.docs.map(async(snap) => {
            const data = snap.data();
            return {
                id: snap.id,
                by: data.by,
                name: data.name,
                dp: await getDp(data.by),
                timestamp: data.timestamp?.toDate(),
                message: data.message,
                likes: data.likes,
                replies: data.replies,
                liked: data.liked?.includes(fs.auth.currentUser.uid),
            };
        }));
        setComments(old => [...old, ...newData]);
    }catch{}
}

export const deleteComment = async(id) => {
    const fs = require('../hooks/useData');
    try{
        const docRef = doc(fs.db, 'comment', id);
        await deleteDoc(docRef);
        Toast.show({ text1: 'Reply deleted!' });
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
}

export const replyComment = async(id, text) => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            for: id,
            by: fs.auth.currentUser.uid,
            name: fs.auth.currentUser.displayName,
            message: text,
            timestamp: serverTimestamp(),
            likes: 0,
            replies: 0,
        };

        const data2 = {
            replies: increment(1),
        };

        const docRef = collection(fs.db, 'comment');
        const docRef2 = doc(fs.db, 'comment', id);

        updateDoc(docRef2, data2);
        const ref = await addDoc(docRef, data);
        Toast.show({ text1: 'Subply sent!' });
        return ref.id;
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
        return null;
    }
}

export const likeComment = async(id) => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            likes: increment(1),
            liked: arrayUnion(...[fs.auth.currentUser.uid])
        };

        const docRef = doc(fs.db, 'comment', id);
        await updateDoc(docRef, data);

    }catch{}
}

export const disLikeComment = async(id) => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            likes: increment(-1),
            liked: arrayRemove(...[fs.auth.currentUser.uid])
        };

        const docRef = doc(fs.db, 'comment', id);
        await updateDoc(docRef, data);

    }catch{}
}