import Toast from "react-native-toast-message";
import { auth, db, pushListeners } from "../../hooks";
import { uploadFile, category as cat, getDp } from "../../functions";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';

export const fetchTribes = async(setTribes, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, async(snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setTribes(await Promise.all(snap.docs.map(async(snap) => {

                const data = snap.data();
                const userRef = doc(db, 'tribe', snap.id, 'member', auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();

                const tribeData = {
                    roomId: snap.id,
                    title: data.title,
                    verified: data.verified,
                    desc: data.desc,
                    population: data.population,
                    bgImg: data.bgImg,
                    dp: data.dp,
                    category: data.category,
                    icon: data.icon,
                    Public: data.public,
                    owner: userData.owner,
                    meAdmin: userData.meAdmin,
                    isMember: userDoc.exists(),
                    msg: data.msg-userData.msg || 0,
                    admin: data.admin-userData.admin || 0,
                    post: data.admin-userData.post || 0,
                    poll: data.poll-userData.poll || 0,
                    file: data.file-userData.file || 0,
                    mention: userData.mention || 0,
                };

                return tribeData;
            })));
        });
        pushListeners(listener);
    }catch(e){}
};

export const fetchNextTribes = async(setTribes, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const tribes = await getDocs(Query);
        const LastVisible = tribes.docs[tribes.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(tribes.docs.map(async(tribe) => {
            const data = tribe.data();
            const userRef = doc(db, 'tribe', tribe.id, 'member', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            return {
                roomId: tribe.id,
                title: data.title,
                verified: data.verified,
                desc: data.desc,
                population: data.population,
                bgImg: data.bgImg,
                dp: data.dp,
                category: data.category,
                icon: data.icon,
                Public: data.public,
                owner: userData.owner,
                meAdmin: userData.meAdmin,
                isMember: userDoc.exists(),
                msg: data.msg-userData.msg || 0,
                admin: data.admin-userData.admin || 0,
                post: data.admin-userData.post || 0,
                poll: data.poll-userData.poll || 0,
                file: data.file-userData.file || 0,
                mention: userData.mention || 0,
            };
        }));
        setTribes(old => [...old, ...newData]);
    }catch{}
};

export const CreateNewTribe = async(props) => {

    const { dp, bgImg, title, desc, category, Public } = props;

    const imgId = Date.now()+Math.random().toString(36)?.substring(2, 15);
    const path = `tribes/dp/${imgId}_dp.webp`;
    const matchedCategory = cat.find(obj => obj.value === category);

    try{
        const uri = await uploadFile(dp, path, 'image/webp');
        if(uri===null){
            Toast.show({ text1: 'Max size of tribe display picture is 2 MB' });
            return null;
        }

        const tribeData = {
            tribeId: null,
            title: title?.trim(),
            desc: desc?.trim(),
            verified: false,
            dp: uri,
            bgImg: bgImg,
            category: category,
            icon: matchedCategory.icon,
            public: Public,
            timestamp: serverTimestamp(),
            population: 0,
            msg: 0,
            admin: 0,
            post: 0,
            poll: 0,
            file: 0,
            searchTerm: title?.trim()?.toLowerCase(),
        };

        const collectionRef = collection(db, 'tribe');
        const tribeRef = await addDoc(collectionRef, tribeData);

        const newData = {
            tribeId: tribeRef.id,
        };

        const tribeDocRef = doc(db, 'tribe', tribeRef.id);

        await updateDoc(tribeDocRef, newData);
        await joinTribe(tribeRef.id, true, true, category);

        return tribeRef.id;
    }catch{}
};

export const joinTribe = async(roomId, owner, admin, tCat) => {
    try{

        const tribeData = {
            population: increment(1),
            member: arrayUnion(...[auth.currentUser.uid]),
        };

        const memberData = {
            name: auth.currentUser.displayName,
            owner: owner,
            meAdmin: admin,
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
            interests: arrayUnion(...[tCat]),
        };

        const tribeDocRef = doc(db, 'tribe', roomId);
        const memberDocRef = doc(db, 'tribe', roomId, 'member', auth.currentUser.uid);
        const userDocRef = doc(db, 'user', auth.currentUser.uid);

        setDoc(memberDocRef, memberData);
        updateDoc(userDocRef, userData);
        await updateDoc(tribeDocRef, tribeData);

    }catch{}
};

export const updateNum = async(roomId, numType, num) => {
    try{
        const data = {
            [`${numType}`]: increment(num),
        };
        const docRef = doc(db, 'tribe', roomId, 'member', auth.currentUser.uid);
        await updateDoc(docRef, data);
    }catch{}
};

export const checkMemberShip = async(roomId) => {
    try{
        const docRef = doc(db, 'tribe', roomId, 'member', auth.currentUser.uid);
        const me = await getDoc(docRef);
        return me.exists();
    }catch{
        return false;
    }
};

export const getTribe = async(roomId, setData, setMember) => {
    try{
        const docRef = doc(db, 'tribe', roomId);
        const tribeDoc = await getDoc(docRef);
        if(!tribeDoc.exists()) return false;
        const memberRef = doc(db, 'tribe', roomId, 'member', auth.currentUser.uid);
        const me = await getDoc(memberRef);
        setMember(me.exists());
        const data = tribeDoc.data();
        setData({
            roomId: tribeDoc.id,
            title: data.title,
            verified: data.verified,
            desc: data.desc,
            population: data.population,
            bgImg: data.bgImg,
            dp: data.dp,
            category: data.category,
            icon: data.icon,
            Public: data.public,
            isMember: me.exists(),
            owner: me.data()?.owner || false,
            meAdmin: me.data()?.meAdmin || false,
            msg: 0,
            admin: 0,
            post: 0,
            poll: 0,
            file: 0,
            mention: 0,
        });
        return true;
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
};

export const askToJoin = async(roomId) => {
    try{

        const data = {
            by: auth.currentUser.uid,
            name: auth.currentUser.displayName,
            dp: auth.currentUser.photoURL,
            element: 'request',
            timestamp: serverTimestamp(),
            status: 'requested'
        };

        const data2 = {
            admin: increment(1),
            timestamp: serverTimestamp(),
        };

        const msgRef = doc(db, 'tribe', roomId, 'admin', `${auth.currentUser.uid}-request`);
        const tribeRef = doc(db, 'tribe', roomId);
        await setDoc(msgRef, data);
        updateDoc(tribeRef, data2);

        Toast.show({ text1: 'Requested' });

    }catch{}
};

export const searchMyTribes = async(setTribes, term, handleChange, Limit) => {
    try{
        const searchTerm = term?.trim();
        const Query = query(collection(db, 'tribe'), where('member', 'array-contains', auth.currentUser.uid), where('searchTerm', '>=', searchTerm), where('searchTerm', '<=', searchTerm+'\uf8ff'), orderBy('searchTerm'), limit(Limit));
        const tribes = await getDocs(Query);
        const newData = await Promise.all(tribes.docs.map(async(tribe) => {
            const data = tribe.data();
            const userRef = doc(db, 'tribe', tribe.id, 'member', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            return {
                roomId: tribe.id,
                title: data.title,
                verified: data.verified,
                desc: data.desc,
                population: data.population,
                bgImg: data.bgImg,
                dp: data.dp,
                category: data.category,
                icon: data.icon,
                Public: data.public,
                owner: userData.owner,
                meAdmin: userData.meAdmin,
                isMember: userDoc.exists(),
                msg: data.msg-userData.msg || 0,
                admin: data.admin-userData.admin || 0,
                post: data.admin-userData.post || 0,
                poll: data.poll-userData.poll || 0,
                file: data.file-userData.file || 0,
                mention: userData.mention || 0,
            };
        }));
        setTribes(old => [...newData, ...old]);
        if(tribes.empty) Toast.show({ text1: 'No results' });
        handleChange({ loading: false });
    }catch{}
};

export const recommendPosts = async(setPosts, setLastVisible, Limit, tribeId, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('public', '==', true), where('tribeId', 'in', tribeId), orderBy('timestamp', 'desc'), orderBy('likes', 'desc'), limit(Limit));
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
                tribeId: data.tribeId, 
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
                dp: data.by===auth.currentUser.uid?auth.currentUser.photoURL: await getDp(data.by), 
            };
        })));
    }catch{}
};

export const recommendNextPosts = async(setPosts, lastVisible, setLastVisible, Limit, toggleIndicator, tribeId, addToLikeArr) => {
    try{
        const Query = query(collection(db, 'post'), where('public', '==', true), where('tribeId', 'in', tribeId), orderBy('timestamp', 'desc'), orderBy('likes', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        if(docRef.empty){
            toggleIndicator(false);
            return;
        }
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
                tribeId: data.tribeId, 
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
                dp: data.by===auth.currentUser.uid?auth.currentUser.photoURL: await getDp(data.by), 
            };
        }));
        setPosts(old => [...old, ...newData]);
    }catch{}
};