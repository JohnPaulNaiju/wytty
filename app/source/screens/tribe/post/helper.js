import { auth, db } from "../../../hooks";
import Toast from "react-native-toast-message";
import { deleteFile, detectSpamPost, uploadFile, claimWoint, getDp } from "../../../functions";
import { collection, getDocs, limit, orderBy, query, where, doc, getDoc, startAfter, serverTimestamp, addDoc, updateDoc, increment, setDoc, deleteDoc } from "firebase/firestore";

export const getPost = async(roomId, setArray1, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('tribeId', '==', roomId), orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setArray1(await Promise.all(docRef.docs.map(async(post) => {
            const data = post.data();
            const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
            const liked = await getDoc(likeRef);
            addToLikeArr(post.id, liked.exists(), data.likes, data.comments);
            return { 
                id: post.id, 
                by: data.by, 
                name: data.name, 
                timestamp: data.timestamp?.toDate(), 
                spoiler: data.spoiler, 
                scontent: data.scontent, 
                lastComment: data.lastComment, 
                Public: data.public, 
                token: data.token, 
                verified: data.verified, 
                ...data.text&&{ text: data.text }, 
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight },
                ...data.imageUrl&&{ imageUrl: data.imageUrl }, 
                ...data.vidUrl&&{ vidUrl: data.vidUrl }, 
                dp: data.by===auth.currentUser.uid?auth.currentUser.photoURL:await getDp(data.by),
            };
        })));
    }catch{}
};

export const getNextPost = async(roomId, setArray1, lastVisible, setLastVisible, Limit, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('tribeId', '==', roomId), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible)
        const newData = await Promise.all(docRef.docs.map(async(post) => {
            const data = post.data();
            const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
            const liked = await getDoc(likeRef);
            addToLikeArr(post.id, liked.exists(), data.likes, data.comments);
            return { 
                id: post.id, 
                by: data.by, 
                name: data.name, 
                timestamp: data.timestamp?.toDate(), 
                spoiler: data.spoiler, 
                scontent: data.scontent, 
                lastComment: data.lastComment, 
                Public: data.public, 
                token: data.token, 
                verified: data.verified, 
                ...data.text&&{ text: data.text }, 
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight },
                ...data.imageUrl&&{ imageUrl: data.imageUrl }, 
                ...data.vidUrl&&{  vidUrl: data.vidUrl }, 
                dp: data.by===auth.currentUser.uid?auth.currentUser.photoURL:await getDp(data.by),
            };
        }));
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const createPost = async(roomId, verified, Public, props) => {

    detectSpamPost();

    const { text, img, video, spoiler, mediaHeight } = props;

    const mediaId = Date.now()+Math.random().toString(36)?.substring(2, 15);
    const imgPath = `users/${auth.currentUser.uid}/posts/${mediaId}_img.webp`;
    const vidPath = `users/${auth.currentUser.uid}/posts/${mediaId}_vid.mp4`;

    try{

        let uri = '';
        if(img) uri = await uploadFile(img, imgPath, 'image/webp');
        if(video) uri = await uploadFile(video, vidPath, 'video/webm');

        if(uri===null){
            Toast.show({ text1: 'Oops! Max size is 25 MB' });
            return null;
        }

        const content = {
            by: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            timestamp: serverTimestamp(),
            ...text&&{ text: text?.trim() },
            ...img&&{ 
                imageUrl: uri, 
                mediaHeight: mediaHeight,
            },
            ...video&&{ 
                vidUrl: uri, 
                mediaHeight: mediaHeight,
            },
            spoiler: spoiler,
            likes: 0,
            comments: 0,
            scontent: false,
            public: Public,
            tribeId: roomId,
            verified: verified
        };

        const tribeData = {
            timestamp: serverTimestamp(),
            post: increment(1),
        };

        const docRef = collection(db, 'post');
        const tribeRef = doc(db, 'tribe', roomId);

        const ref = await addDoc(docRef, content);
        updateDoc(tribeRef, tribeData);

        if(Public) claimWoint(5);

        return ref.id;
    }catch{}
};

export const likePost = (postId) => {
    try{

        const likeData = {
            name: auth.currentUser.displayName,
        };

        const likeRef = doc(db, 'post', postId, 'likedby', auth.currentUser.uid);

        setDoc(likeRef, likeData).then(() => {

            const data = {
                likes: increment(1),
            };

            const docRef = doc(db, 'post', postId);

            updateDoc(docRef, data);
        });
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
};

export const disLikePost = (postId) => {
    try{

        const likeRef = doc(db, 'post', postId, 'likedby', auth.currentUser.uid);

        deleteDoc(likeRef).then(() => {

            const data = {
                likes: increment(-1),
            };

            const docRef = doc(db, 'post', postId);

            updateDoc(docRef, data);
        });
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
};

export const modifyCommentNum = async(postId, num, comment) => {
    try{

        const data = {
            comments: increment(num),
            lastComment: {
                comment: comment,
                dp: auth.currentUser.photoURL,
                by: auth.currentUser.uid,
                name: auth.currentUser.displayName,
            }
        };

        const docRef = doc(db, 'post', postId);

        await updateDoc(docRef, data);
    }catch{}
};

export const delPost = async(postId, url, Public) => {
    try{
        if(url) deleteFile(url);
        const docRef = doc(db, 'post', postId);
        await deleteDoc(docRef);
        if(Public) claimWoint(-5);
        Toast.show({ text1: 'Post deleted' });
    }catch{
        Toast.show({ text1: "Couldn't delete post" });
    }
};