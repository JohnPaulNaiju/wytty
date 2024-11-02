import { auth, db, limits } from "../../hooks";
import { collection, getDocs, limit, orderBy, query, startAfter, where, getDoc, doc } from "firebase/firestore";

const { tLimit } = limits;

export const recommendTribes = async(category, setTribes, setLastVisible, Limit, tribeId) => {
    try{
        const Query = query(collection(db, 'tribe'), where('public', '==', true), where('category', '==', category), where('population', '<', tLimit), orderBy('population', 'asc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setTribes(docRef.docs.map((tribe) => {
            const data = tribe.data();
            if(tribeId?.includes(tribe.id)) return null;
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
                people: data.member?.slice(0,3),
            };
        }));
    }catch{}
};

export const recommendNextTribes = async(category, setTribes, lastVisible, setLastVisible, Limit, tribeId) => {
    try{
        const Query = query(collection(db, 'tribe'), where('public', '==', true), where('category', '==', category), where('population', '<', tLimit), orderBy('population', 'asc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((tribe) => {
            const data = tribe.data();
            if(tribeId?.includes(tribe.id)) return null;
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
                people: data.member?.slice(0,3),
            };
        });
        setTribes(old => [...old, ...newData]);
    }catch{}
};

export const recommendAllTribes = async(setTribes, setLastVisible, Limit, tribeId) => {
    try{
        const Query = query(collection(db, 'tribe'), where('public', '==', true), where('population', '<', tLimit), orderBy('population', 'asc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setTribes(docRef.docs.map((tribe) => {
            const data = tribe.data();
            if(tribeId?.includes(tribe.id)) return null;
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
                people: data.member?.slice(0,3),
            };
        }));
    }catch{}
};

export const recommendNextAllTribes = async(setTribes, lastVisible, setLastVisible, Limit, tribeId) => {
    try{
        const Query = query(collection(db, 'tribe'), where('public', '==', true), where('population', '<', tLimit), orderBy('population', 'asc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((tribe) => {
            const data = tribe.data();
            if(tribeId?.includes(tribe.id)) return null;
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
                people: data.member?.slice(0,3),
            };
        });
        setTribes(old => [...old, ...newData]);
    }catch{}
};

export const recommendUser = async(connectionId, cat, setUsers, Limit) => {
    try{
        const Query = query(collection(db ,'user'), where('interests', 'array-contains', cat), orderBy('joined', 'asc'), orderBy('connection', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        setUsers(await Promise.all(docRef.docs.map(async(user) => {
            const data = user.data();
            if(connectionId?.includes(user.id)) return null;
            const docRef1 = await getDoc(doc(db, 'user', user.id, 'request_r', auth.currentUser.uid));
            if(docRef1.exists()) return null;
            const docRef2 = await getDoc(doc(db, 'user', auth.currentUser.uid, 'request_r', user.id));
            if(docRef2.exists()) return null;
            return {
                id: user.id,
                name: data.name,
                username: data.username,
                dp: data.dplink,
                bio: data.bio,
                verified: data.verified,
                token: data.token,
            };
        })));
    }catch{}
};

// export const recommendNextUser = async(connectionId, cat, setUsers, lastVisible, setLastVisible, Limit) => {
//     try{
//         const Query = query(collection(db ,'user'), where('interests', 'array-contains', cat), orderBy('joined', 'asc'), orderBy('connection', 'desc'), startAfter(lastVisible), limit(Limit));
//         const docRef = await getDocs(Query);
//         const LastVisible = docRef.docs[docRef.docs.length-1];
//         setLastVisible(LastVisible);
//         const newData = await Promise.all(docRef.docs.map(async(user) => {
//             const data = user.data();
//             if(connectionId?.includes(user.id)) return null;
//             const docRef1 = await getDoc(doc(db, 'user', user.id, 'request_r', auth.currentUser.uid));
//             if(docRef1.exists()) return null;
//             const docRef2 = await getDoc(doc(db, 'user', auth.currentUser.uid, 'request_r', user.id));
//             if(docRef2.exists()) return null;
//             return {
//                 id: user.id,
//                 name: data.name,
//                 username: data.username,
//                 dp: data.dplink,
//                 bio: data.bio,
//                 verified: data.verified,
//                 token: data.token,
//             };
//         }));
//         setUsers(old => [...old, ...newData]);
//     }catch{}
// };