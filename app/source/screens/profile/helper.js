import { db, auth } from "../../hooks";
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword, updateEmail, updateProfile } from 'firebase/auth';
import { sendNotification, uploadFile, getAccountData, storeAccounts } from '../../functions';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';

export const Request = async(id, username, token) => {
    try{

        const route = 'OthersProfile';
        const title = username;
        const params = { id: auth.currentUser.uid, username: auth.currentUser.displayName };
        const msg = `${auth.currentUser.displayName} wants to connect with you`;
        const img = auth.currentUser.photoURL;

        const rData = {
            name: auth.currentUser.displayName,
            timestamp: serverTimestamp(),
        };

        const sData = {
            name: username,
            timestamp: serverTimestamp(),
        };

        const requestRef = doc(db, 'user', id, 'request_r', auth.currentUser.uid);
        const sendRef = doc(db, 'user', auth.currentUser.uid, 'request_send', id);

        setDoc(requestRef, rData);
        setDoc(sendRef, sData);
        await sendNotification(true, true, false, id, token, title, msg, route, params, img, null);
    }catch{
        Toast.show({ text1: 'Error sending connection request' });
    }
};

export const UnRequest = async(id) => {
    try{
        const requestRef = doc(db, 'user', id, 'request_r', auth.currentUser.uid);
        const sendRef = doc(db, 'user', auth.currentUser.uid, 'request_send', id);

        deleteDoc(requestRef);
        await deleteDoc(sendRef);
    }catch{
        Toast.show({ text1: 'Error withdrawing connection request' });
    }
};

export const Connect = async(id, username, token) => {
    try{

        const route = 'OthersProfile';
        const title = username;
        const params = { id: auth.currentUser.uid, username: auth.currentUser.displayName };
        const msg = `${auth.currentUser.displayName} accepted your connection`;
        const img = auth.currentUser.photoURL;

        const data1 = {
            name: username,
        };

        const data2 = {
            name: auth.currentUser.uid,
        };

        const data3 = {
            connection: increment(1),
            connectionId: arrayUnion(...[id]),
        };

        const data4 = {
            connection: increment(1),
            connectionId: arrayUnion(...[auth.currentUser.uid]),
        };

        const requestRef = doc(db, 'user', auth.currentUser.uid, 'request_r', id);
        const sendRef = doc(db, 'user', id, 'request_send', auth.currentUser.uid);

        const cRef1 = doc(db, 'user', auth.currentUser.uid, 'connection', id);
        const cRef2 = doc(db, 'user', id, 'connection', auth.currentUser.uid);

        const userRef1 = doc(db, 'user', auth.currentUser.uid);
        const userRef2 = doc(db, 'user', id);

        deleteDoc(requestRef);
        deleteDoc(sendRef);
        setDoc(cRef1, data1);
        setDoc(cRef2, data2);
        updateDoc(userRef1, data3);
        updateDoc(userRef2, data4);
        await sendNotification(true, true, false, id, token, title, msg, route, params, img, null);
    }catch{
        Toast.show({ text1: 'An unexpected error occured while connecting' });
    }
};

export const DisConnect = async(id) => {
    try{

        const data1 = {
            connection: increment(-1),
            connectionId: arrayRemove(...[id]),
        };

        const data2 = {
            connection: increment(-1),
            connectionId: arrayRemove(...[auth.currentUser.uid]),
        };

        const cRef1 = doc(db, 'user', auth.currentUser.uid, 'connection', id);
        const cRef2 = doc(db, 'user', id, 'connection', auth.currentUser.uid);
        const userRef1 = doc(db, 'user', auth.currentUser.uid);
        const userRef2 = doc(db, 'user', id);

        deleteDoc(cRef1);
        deleteDoc(cRef2);
        updateDoc(userRef1, data1);
        await updateDoc(userRef2, data2);
    }catch{
        Toast.show({ text1: 'Error withdrawing connections' });
    }
};

export const rejectRequest = async(id) => {
    try{
        const requestRef = doc(db, 'user', auth.currentUser.uid, 'request_r', id);
        const sendRef = doc(db, 'user', id, 'request_send', auth.currentUser.uid);

        deleteDoc(requestRef);
        await deleteDoc(sendRef);
    }catch{
        Toast.show({ text1: 'Error rejecting request' });
    }
};

export const updateDp = async(uri) => {
    try{

        const path = `users/${auth.currentUser.uid}/dp.webp`;
        const userRef = doc(db, 'user', auth.currentUser.uid);

        Toast.show({ text1: "Updating profile picture..." });

        const url = await uploadFile(uri, path, 'image/webp');
        if(!url){
            Toast.show({ text1: 'Profile picture max size is 1 MB' });
            return;
        }

        const data = {
            dplink: url,
        };

        updateProfile(auth.currentUser, { photoURL: url });
        await updateDoc(userRef, data);
        Toast.show({ text1: 'Profile picture updated 🎉' });
        return true;
    }catch{
        Toast.show({ text1: 'Error updating profile picture' });
        return null;
    }
};

export const getUserTribe = async(id, setTribes, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', id), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setTribes(docRef.docs.map((snap) => {
            const data = snap.data();
            return {
                roomId: snap.id,
                title: data.title,
                desc: data.desc,
                population: data.population,
                bgImg: data.bgImg,
                dp: data.dp,
                category: data.category,
                icon: data.icon,
                verified: data.verified,
                Public: data.public,
                people: data.member?.slice(0,3),
            };
        }));
    }catch{}
};

export const getNextUserTribe = async(id, setTribes, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', id), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((snap) => {
            const data = snap.data();
            return {
                roomId: snap.id,
                title: data.title,
                desc: data.desc,
                population: data.population,
                bgImg: data.bgImg,
                dp: data.dp,
                category: data.category,
                icon: data.icon,
                verified: data.verified,
                Public: data.public,
                people: data.member?.slice(0,3),
            };
        });
        setTribes(old => [...old, ...newData]);
    }catch{}
};

export const getUserPost = async(userId, setPosts, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('by', '==', userId), where('public', '==', true), orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setPosts(await Promise.all(docRef.docs.map(async(post) => {
            const data = post.data();
            const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
            const liked = await getDoc(likeRef);
            addToLikeArr(post.id, liked.exists(), data.likes, data.comments);
            return { 
                id: post.id, 
                by: data.by, 
                name: data.name, 
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
        })));
    }catch{}
};

export const getNextUserPost = async(userId, setPosts, lastVisible, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('by', '==', userId), where('public', '==', true), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(docRef.docs.map(async(post) => {
            const data = post.data();
            const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
            const liked = await getDoc(likeRef);
            addToLikeArr(post.id, liked.exists(), data.likes, data.comments);
            return { 
                id: post.id, 
                by: data.by, 
                name: data.name, 
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
        setPosts(old => [...old, ...newData]);
    }catch{}
};

export const getUserSinglePost = async(userId, setPost, abortController) => {
    try{
        const Query = query(collection(db, 'post'), where('by', '==', userId), where('public', '==', true), orderBy('timestamp', 'desc'), limit(1));
        const docRef = await getDocs(Query, { signal: abortController });
        setPost(await Promise.all(docRef.docs.map(async(post) => {
            const data = post.data();
            return { 
                id: post.id, 
                by: data.by, 
                name: data.name, 
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
        })));
    }catch{}
};

export const getUserSingleTribe = async(id, setTribe, abortController) => {
    try{
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', id), limit(1));
        const docRef = await getDocs(Query, { signal: abortController });
        setTribe(docRef.docs.map((snap) => {
            const data = snap.data();
            return {
                roomId: snap.id,
                title: data.title,
                desc: data.desc,
                population: data.population,
                bgImg: data.bgImg,
                dp: data.dp,
                category: data.category,
                icon: data.icon,
                verified: data.verified,
                Public: data.public,
                people: data.member?.slice(0,3),
            };
        }));
    }catch{}
};

export const saveNewEmail = async(newEmail) => {
    try{

        const thisData = await getAccountData(auth.currentUser.uid);

        if(!thisData){
            Toast.show({ text1: 'Error! To resolve the issue sign out and login to account again' });
            return null;
        }

        await signInWithEmailAndPassword(auth, thisData.email, thisData.passwd).then(async() => {

            const data = {
                email: newEmail,
            };

            const userRef = doc(db, 'user', auth.currentUser.uid);
            const userNameRef = doc(db, 'username', auth.currentUser.displayName);

            await updateEmail(auth.currentUser, newEmail);
            await updateDoc(userRef, data);
            await updateDoc(userNameRef, data);
            await storeAccounts(auth.currentUser.displayName, thisData.passwd, auth.currentUser.uid, newEmail);
        });
        return true;
    }catch{
        Toast.show({ text1: "Error! This email might be in use" });
        return null;
    }
};