import { db, auth } from "../../../hooks";
import Toast from "react-native-toast-message";
import { query, collection, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";

export const searchMsg = async(roomId, term, setArray, setLastVisible, Limit, asc) => {
    const Asc = asc?'asc':'desc';
    const searchTerm = term?.trim();
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('searchTerm', 'array-contains', searchTerm), orderBy('timestamp', Asc), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setArray(docRef.docs.map((msg) => {
            const data = msg.data();
            return {
                id: msg.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.noteId&&{ noteId: data.noteId },
                ...data.element==='text' && { 
                    message: data.message, 
                    code: data.code,
                },
                ...data.link&&{
                    link: data.link,
                    limg: data.limg,
                    ltitle: data.ltitle,
                },
                ...data.element==='poll' && {
                    question: data.question,
                    option: data.option,
                    totalVote: data.totalVote,
                    voted: data?.vote?.includes(auth.currentUser.uid),
                    votes: data.vote?.length,
                    people: data.vote?.slice(-3),
                },
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
        if(docRef.empty) Toast.show({ text1: 'No messages found' });
    }catch{}
};

export const gextNextMsg = async(roomId, term, setArray, lastVisible, setLastVisible, Limit, asc) => {
    const Asc = asc?'asc':'desc';
    const searchTerm = term?.trim();
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('searchTerm', '>=', searchTerm), where('searchTerm', '<=', searchTerm+'\uf8ff'), orderBy('searchTerm', 'asc'), orderBy('timestamp', Asc), startAfter(lastVisible), limit(Limit));
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
                ...data.element==='text' && { 
                    message: data.message, 
                    code: data.code,
                },
                ...data.link&&{
                    link: data.link,
                    limg: data.limg,
                    ltitle: data.ltitle,
                },
                ...data.element==='poll' && {
                    question: data.question,
                    option: data.option,
                    totalVote: data.totalVote,
                    voted: data?.vote?.includes(auth.currentUser.uid),
                    votes: data.vote?.length,
                    people: data.vote?.slice(-3),
                },
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
        setArray(old => [...old, ...newData]);
    }catch{}
};