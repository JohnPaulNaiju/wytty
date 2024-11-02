import { db } from "../../hooks";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export const getUsers = async(setUsers, term, handleChange, setLastVisible, Limit) => {
    try{
        const searchTerm = term?.trim();
        const Query = query(collection(db, 'user'), where('username', '>=', searchTerm), where('username', '<=', searchTerm+'\uf8ff'), orderBy('username'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setUsers(docRef.docs.map((user) => {
            const data = user.data();
            return {
                id: user.id,
                name: data.name,
                username: data.username,
                dp: data.dplink,
                verified: data.verified,
                bio: data.bio,
                woint: data.woint || 0
            };
        }));
        if(docRef?.empty) handleChange({ noresult: true });
        handleChange({ loading: false });
    }catch{}
};

export const getNextUsers = async(setUsers, term, lastVisible, setLastVisible, Limit) => {
    try{
        const searchTerm = term?.trim();
        const Query = query(collection(db, 'user'), where('username', '>=', searchTerm), where('username', '<=', searchTerm+'\uf8ff'), orderBy('username'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((user) => {
            const data = user.data();
            return {
                id: user.id,
                name: data.name,
                username: data.username,
                dp: data.dplink,
                verified: data.verified,
                bio: data.bio,
                woint: data.woint || 0
            };
        });
        setUsers(old => [...old, ...newData]);
    }catch{}
};

export const getTribes = async(setTribes, term, handleChange, setLastVisible, Limit) => {
    try{
        const searchTerm = term?.trim();
        const Query = query(collection(db, 'tribe'), where('searchTerm', '>=', searchTerm), where('searchTerm', '<=', searchTerm+'\uf8ff'), orderBy('searchTerm'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setTribes(docRef.docs.map((tribe) => {
            const data = tribe.data();
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
        if(docRef.empty) handleChange({ noresult: true });
        handleChange({ loading: false });
    }catch{}
};

export const getNextTribes = async(setTribes, term, lastVisible, setLastVisible, Limit) => {
    try{
        const searchTerm = term?.trim();
        const Query = query(collection(db, 'tribe'), where('searchTerm', '>=', searchTerm), where('searchTerm', '<=', searchTerm+'\uf8ff'), orderBy('searchTerm'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((tribe) => {
            const data = tribe.data();
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