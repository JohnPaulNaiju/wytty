import { auth, db } from "../../../hooks";
import Toast from "react-native-toast-message";
import { deleteFile, detectSpamMessage, removeStopWords, sendNotification, summarizeText } from "../../../functions";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from "firebase/firestore";

export const fetchMessages = (roomId, setMessages, unsubscribe, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setMessages(snap.docs.map((msg) => {
                const data = msg.data();
                return {
                    id: msg.id, 
                    by: data.by, 
                    name: data.name, 
                    element: data.element, 
                    timestamp: data.timestamp?.toDate(), 
                    ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                    ...data.element==='text' && { 
                        message: data.message, 
                        code: data.code,
                    }, 
                    ...data.element==='image' && { 
                        imageUrl: data.imageUrl, 
                        scontent: data.scontent, 
                    }, 
                    ...data.element==='sticker' && { imageUrl: data.imageUrl }, 
                    ...data.reply&&{ 
                        reply: data.reply, 
                        replymsg: data.replymsg, 
                        replyingto: data.replyingto, 
                        replier: data.replier, 
                        relement: data.relement, 
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
        });
        unsubscribe.push(listener);
    }catch{}
};

export const fetchNextMessages = async(roomId, setMessages, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
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
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                ...data.element==='text' && { 
                    message: data.message, 
                    code: data.code, 
                }, 
                ...data.element==='image' && { 
                    imageUrl: data.imageUrl, 
                    scontent: data.scontent, 
                }, 
                ...data.element==='sticker' && { imageUrl: data.imageUrl }, 
                ...data.reply&&{ 
                    reply: data.reply, 
                    replymsg: data.replymsg, 
                    replyingto: data.replyingto, 
                    replier: data.replier, 
                    relement: data.relement, 
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
        setMessages(old => [...old, ...newData]);
    }catch{}
};

export const DeleteMessage = async(roomId, msgId, url) => {
    try{
        if(url) deleteFile(url);
        const docRef = doc(db, 'tribe', roomId, 'message', msgId);
        await deleteDoc(docRef);
    }catch{}
};

const cleoReply = async(roomId, msg) => {
    try{
        const arr = [{ role: 'user', content: msg }];
        const reply = await summarizeText(arr);
        const data = {
            by: '@cleo',
            name: 'cleo AI',
            element: 'text',
            timestamp: serverTimestamp(),
            message: reply,
            reply: true, 
            replymsg: msg, 
            replyingto: auth.currentUser.displayName, 
            replier: 'cleo AI', 
            relement: 'text', 
        };
        const docRef = collection(db, 'tribe', roomId, 'message');
        await addDoc(docRef, data);
    }catch{}
};

export const SaveMessage = async(roomId, msg, element, url, reply, note, code, mediaHeight) => {
    try{

        detectSpamMessage();

        const data = {
            by: auth.currentUser.uid, 
            name: auth.currentUser.displayName, 
            element: element, 
            timestamp: serverTimestamp(),
            ...mediaHeight&&{ mediaHeight: mediaHeight },
            ...element==='image' && { 
                imageUrl: url, 
                scontent: false, 
            }, 
            ...element==='text' && { 
                message: msg, 
                searchTerm: removeStopWords(msg), 
                ...code&&{ code: true },
            }, 
            ...element==='sticker' && { imageUrl: url }, 
            ...element==='note' && {
                noteId: note?.id,
                title: note?.title,
                category: note?.cat,
                searchTerm: removeStopWords(note?.title), 
                message: note?.msg?.trim(), 
            },
            ...element==='file' && {
                filename: note?.name,
                size: note?.size,
                fileUrl: note?.url,
                mime: note?.mime,
                category: note?.cat,
                searchTerm: removeStopWords(note?.name), 
                message: note?.msg?.trim(), 
            },
            ...reply?.reply && { 
                reply: reply?.reply, 
                replymsg: reply?.relement!=='text'?reply?.replymsg:reply?.replymsg?.substring(0, 80), 
                replyingto: reply?.replyingto, 
                replier: auth.currentUser.displayName, 
                relement: reply?.relement, 
            }, 
        };

        const tribeData = {
            msg: increment(1),
            ...element==='note'||element==='file' &&{ file: increment(1) },
            timestamp: serverTimestamp(),
        };

        const docRef = collection(db, 'tribe', roomId, 'message');
        const tribeRef = doc(db, 'tribe', roomId);

        const ref = await addDoc(docRef, data);
        updateDoc(tribeRef, tribeData);

        if(reply?.reply){
            try{
                if(reply?.ruid===auth.currentUser.uid) return;

                const title = reply?.replyingto;
                const body = `${auth.currentUser.displayName} mentioned you in their message`;

                const mentionData = {
                    mention: increment(1),
                };

                const memberRef = doc(db, 'tribe', roomId, 'member', reply?.ruid);
                updateDoc(memberRef, mentionData);

                sendNotification(true, false, false, reply?.ruid, null, title, body, null, null, null, null);
            }catch{}
        }
        const cleoregex = /^@cleo/;
        if(cleoregex.test(msg)) cleoReply(roomId, msg);
        return ref.id;
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
        return null;
    }
};

export const linkUpdate = async(roomId, msgId, link, title, img) => {
    try{

        const data = {
            link: link,
            ltitle: title,
            limg: img,
        };

        const docRef = doc(db, 'tribe', roomId, 'message', msgId);
        await updateDoc(docRef, data);

    }catch{}
};

export const searchNote = async(term, setNotes, setLastVisible, Limit, handleChange) => {
    try{
        const Query = query(collection(db, 'user', auth.currentUser.uid, 'note'), where('searchTerm', '>=', term), where('searchTerm', '<=', term+'\uf8ff'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setNotes(docRef.docs.map((note) => {
            const data = note.data();
            return {
                id: note.id,
                title: data.title,
                firstElement: data?.elements[0] || null,
            };
        }));
        if(docRef.empty) handleChange({ noresult: true });
        handleChange({ loading: false });
    }catch{}
};

export const getNextNote = async(term, setNotes, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'user', auth.currentUser.uid, 'note'), where('searchTerm', '>=', term), where('searchTerm', '<=', term+'\uf8ff'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((note) => {
            const data = note.data();
            return {
                id: note.id,
                title: data.title,
                firstElement: data?.elements[0] || null,
            };
        });
        setNotes(old => [...old, ...newData])
    }catch{}
};

export const getCategories = async(roomId, setArray, unsubscribe) => {
    try{
        const docRef = doc(db, 'tribe', roomId, 'other', 'category');
        const listener = onSnapshot(docRef, (snap) => {
            const data = snap.data();
            if(snap.exists()) setArray(data?.categories);
            else setArray([]);
        });
        unsubscribe.push(listener);
    }catch{}
};

export const createCategory = async(roomId, text) => {
    try{

        const data = {
            categories: arrayUnion(...[text]),
        };

        const docRef = doc(db, 'tribe', roomId, 'other', 'category');
        await updateDoc(docRef, data).catch(async() => {
            await setDoc(docRef, data);
        });
    }catch{}
};

export const getMyFiles = async(setFiles) => {
    try{
        const Query = query(collection(db, 'user', auth.currentUser.uid, 'folder'), orderBy('timestamp', 'desc'));
        const docRef = await getDocs(Query);
        setFiles([]);
        docRef.docs.map((file) => {
            const data = file.data();
            data?.files?.map((file) => {
                setFiles(old => [...old, {
                    name: file.name,
                    url: file.url,
                    size: file.size,
                    mime: file.mime,
                }]);
            });
        });
    }catch{}
};

export const summarize = async(msg) => {
    if(msg?.length>5){
        Toast.show({ 
            props: {
                type: 'bot',
                text: '',
            },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
        let messages = '';
        const textarr = [];
        const len = msg?.length>20?20:msg?.length;
        for(let i = 0; i < len; i++){
            if(msg[i].element==='text'){
                textarr.push({
                    name: msg[i].name,
                    msg: msg[i].message,
                });
            }
        }
        const newTextArr = textarr.reverse();
        for(let i = 0; i < newTextArr.length; i++){
            messages = `${messages}.\n ${newTextArr[i].name}: ${newTextArr[i].msg}`;
        }
        if(messages.trim().length===0){ 
            Toast.show({ text1: 'No enough messages '});
            return;
        }
        const arr = [];
        arr.push({
            role: 'user',
            content: `Summarize this conversation: ${messages}`
        });
        const summarizedText = await summarizeText(arr);
        Toast.show({ 
            props: {
                type: 'bot',
                text: summarizedText,
            },
            type: 'dynamicIsland', 
            position: 'top', 
            autoHide: false, 
        });
    }else Toast.show({ text1: 'No enough messages '});
};