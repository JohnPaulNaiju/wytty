import { db, auth } from "../../../hooks";
import { detectSpamMessage, removeStopWords } from '../../../functions';
import { addDoc, arrayUnion, collection, doc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";

export const getPolls = async(roomId, setArray1, unsubscribe, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('element', '==', 'poll'), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setArray1(snap.docs.map((poll) => {
                const data = poll.data();
                return {
                    id: poll.id,
                    by: data.by,
                    name: data.name,
                    element: data.element,
                    timestamp: data.timestamp?.toDate(),
                    ...data.element==='poll' && {
                        question: data.question,
                        option: data.option,
                        totalVote: data.totalVote,
                        voted: data?.vote?.includes(auth.currentUser.uid),
                        votes: data.vote?.length,
                        people: data.vote?.slice(-3),
                    },
                };
            }));
        });
        unsubscribe.push(listener);
    }catch{}
};

export const getNextPolls = async(roomId, setArray1, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('element', '==', 'poll'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((poll) => {
            const data = poll.data();
            return {
                id: poll.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.element==='poll' && {
                    question: data.question,
                    option: data.option,
                    totalVote: data.totalVote,
                    voted: data?.vote?.includes(auth.currentUser.uid),
                    votes: data.vote?.length,
                    people: data.vote?.slice(-3),
                },
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const createPoll = async(roomId, question, option) => {
    try{

        detectSpamMessage();

        const data = {
            by: auth.currentUser.uid, 
            name: auth.currentUser.displayName, 
            element: 'poll', 
            timestamp: serverTimestamp(),
            option: arrayUnion(...option),
            totalVote: 0, 
            ...question&&{
                question: question?.trim(), 
                searchTerm: removeStopWords(question?.trim()),
            },
        };

        const tribeData = {
            msg: increment(1),
            poll: increment(1),
            timestamp: serverTimestamp(),
        };

        const docRef = collection(db, 'tribe', roomId, 'message');
        const tribeRef = doc(db, 'tribe', roomId);

        await addDoc(docRef, data);
        updateDoc(tribeRef, tribeData);
    }catch{}
};

export const updatePollVote = async(roomId, msgId, option) => {
    try{

        const data = {
            option: [...option],
            vote: arrayUnion(...[auth.currentUser.uid]),
            totalVote: increment(1),
        };

        const docRef = doc(db, 'tribe', roomId, 'message', msgId);
        await updateDoc(docRef, data);
    }catch{}
};