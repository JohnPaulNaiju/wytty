import { db } from "../../../hooks";
import { Pexels } from '../../../functions';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";

export const getTribeFiles = async(roomId, setArray1, unsubscribe, setLastVisible, Limit, cat) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('category', '==', cat), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setArray1(snap.docs.map((file) => {
                const data = file.data();
                return {
                    id: file.id,
                    by: data.by,
                    name: data.name,
                    element: data.element,
                    timestamp: data.timestamp?.toDate(),
                    ...data.element==='note' && {
                        noteId: data.noteId,
                        title: data.title,
                        category: data.category,
                        message: data.message,
                    },
                    ...data.element==='file' && {
                        filename: data.filename,
                        size: data.size,
                        fileUrl: data.fileUrl,
                        mime: data.mime,
                        category: data.category,
                        message: data.message,
                    },
                };
            }));
        });
        unsubscribe.push(listener);
    }catch{}
};

export const getNextTribeFiles = async(roomId, setArray1, lastVisible, setLastVisible, Limit, cat) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('category', '==', cat), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((file) => {
            const data = file.data();
            return {
                id: file.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.element==='note' && {
                    noteId: data.noteId,
                    title: data.title,
                    category: data.category,
                    message: data.message,
                },
                ...data.element==='file' && {
                    filename: data.filename,
                    size: data.size,
                    fileUrl: data.fileUrl,
                    mime: data.mime,
                    category: data.category,
                    message: data.message,
                },
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const getCategories = async(roomId, setArray, unsubscribe) => {
    try{
        const docRef = doc(db, 'tribe', roomId, 'other', 'category');
        const listener = onSnapshot(docRef, async(snap) => {
            if(snap.exists()){
                const data = snap.data();
                setArray(await Promise.all(data?.categories?.map(async(item) => ({
                    text: item,
                    bgImg: (await Pexels(item, 0, 1))[0]?.src?.landscape || 'http://bit.ly/3R3CZM4',
                }))));
            }else setArray([]);
        });
        unsubscribe.push(listener);
    }catch{}
};