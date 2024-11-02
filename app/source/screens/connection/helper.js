import Toast from "react-native-toast-message";
import { auth, db, pushListeners } from "../../hooks";
import { deleteFile, detectSpamMessage, removeStopWords } from "../../functions";
import { collection, doc, getDoc, setDoc, arrayUnion, serverTimestamp, updateDoc, increment, addDoc, query, orderBy, limit, onSnapshot, deleteDoc, where, startAfter, getDocs } from "firebase/firestore";

export const getRoomId = (recipientId) => {
    let Id = [auth.currentUser.uid, recipientId];
    if(Id[0]>Id[1]) [Id[0], Id[1]] = [Id[1], Id[0]];
    const roomId = Id[0]+Id[1];
    return roomId;
};

export const checkExists = async(roomId) => {
    try{
        const docRef = doc(db, 'messaging', roomId);
        const isExists = await getDoc(docRef);
        return isExists.exists();
    }catch{
        return false;
    }
};

export const CreateChat = async(roomId, recipientId, recipientUserName) => {
    try{

        const members = [auth.currentUser.uid, recipientId];

        const data = {
            member: arrayUnion(...members),
            [`${auth.currentUser.uid}`]: {
                name: auth.currentUser.displayName,
                notification: true,
                e2ee: false,
            },
            [`${recipientId}`]: {
                name: recipientUserName,
                notification: true,
                e2ee: false,
            },
            lastmessage: null,
            lastmessageby: auth.currentUser.uid,
            seen: false,
            timestamp: serverTimestamp(),
            reply: false,
            element: 'new',
            unread: 0,
        };

        const docRef = doc(db, 'messaging', roomId);
        await setDoc(docRef, data);
    }catch{}
};

export const updateRoomDetails = async(roomId, lastmsg, element) => {
    try{

        const data = {
            lastmessage: lastmsg?lastmsg?.substring(0, 50):null,
            lastmessageby: auth.currentUser.uid,
            seen: false,
            timestamp: serverTimestamp(),
            element: element,
            unread: increment(1)
        };

        const docRef = doc(db, 'messaging', roomId);
        await updateDoc(docRef, data);

    }catch{}
};

export const SaveMessage = async(roomId, msg, element, url, reply, note, mediaHeight) => {
    try{

        detectSpamMessage();

        const data = {
            by: auth.currentUser.uid, 
            element: element, 
            seen: false,
            timestamp: serverTimestamp(), 
            ...mediaHeight&&{ mediaHeight: mediaHeight },
            ...element==='image' && { imageUrl: url }, 
            ...element==='sticker' && { imageUrl: url }, 
            ...element==='text' && { 
                message: msg, 
                searchTerm: removeStopWords(msg), 
            }, 
            ...reply?.reply && { 
                reply: reply?.reply,
                replymsg: reply?.relement==='text'?reply?.replymsg?.substring(0, 80):reply?.replymsg, 
                replyingto: reply?.replyingto, 
                relement: reply?.relement, 
            }, 
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
        };

        const docRef = collection(db, 'messaging', roomId, 'message');
        updateRoomDetails(roomId, msg, element);
        const ref = await addDoc(docRef, data);
        return ref.id;
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
        return null;
    }
};

export const UpdateSeen = async(roomId, id, seen, by) => {
    try{
        if(!seen&&by!==auth.currentUser.uid){
            const docRef1 = doc(db, 'messaging', roomId);
            const docRef2 = doc(db, 'messaging', roomId, 'message', id);

            const data = {
                seen: true,
                unread: 0
            };

            const msgData = {
                seen: true
            };

            updateDoc(docRef1, data);
            await updateDoc(docRef2, msgData);
        }
    }catch{}
};

export const fetchMessages = (roomId, setMessages, unsubscribe, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'messaging', roomId, 'message'), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setMessages(snap.docs.map((msg) => {
                const data = msg.data();
                UpdateSeen(roomId, msg.id, data.seen, data.by);
                return {
                    id: msg.id,
                    by: data.by,
                    element: data.element,
                    seen: data.seen,
                    timestamp: data.timestamp?.toDate(),
                    ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                    ...data.element==='image' && { imageUrl: data.imageUrl }, 
                    ...data.element==='sticker' && { imageUrl: data.imageUrl }, 
                    ...data.element==='text' && { message: data.message }, 
                    ...data.link && { 
                        link: data.link,
                        ltitle: data.ltitle,
                        limg: data.limg,
                    },
                    ...data.reply && { 
                        reply: data.reply,
                        replymsg: data.replymsg,
                        replyingto: data.replyingto, 
                        relement: data.relement, 
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
        const Query = query(collection(db, 'messaging', roomId, 'message'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((msg) => {
            const data = msg.data();
            return {
                id: msg.id,
                by: data.by,
                element: data.element,
                seen: data.seen,
                timestamp: data.timestamp?.toDate(), 
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                ...data.element==='image' && { imageUrl: data.imageUrl }, 
                ...data.element==='sticker' && { imageUrl: data.imageUrl }, 
                ...data.element==='text' && { message: data.message }, 
                ...data.link && { 
                    link: data.link,
                    ltitle: data.ltitle,
                    limg: data.limg,
                },
                ...data.reply && { 
                    reply: data.reply,
                    replymsg: data.replymsg,
                    replyingto: data.replyingto, 
                    relement: data.relement, 
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
        const docRef = doc(db, 'messaging', roomId, 'message', msgId);
        await deleteDoc(docRef);
    }catch{}
};

export const saveChatDetails = async(roomId, notification) => {
    try{

        const data = {
            [`${auth.currentUser.uid}.notification`]: notification
        };

        const docRef = doc(db, 'messaging', roomId);
        await updateDoc(docRef, data);
    }catch{}
};

export const linkUpdate = async(roomId, msgId, link, title, img) => {
    try{

        const data = {
            link: link,
            ltitle: title,
            limg: img,
        };

        const docRef = doc(db, 'messaging', roomId, 'message', msgId);
        await updateDoc(docRef, data);
    }catch{}
};

export const deleteChat = async(roomId) => {
    try{
        const docRef = doc(db, 'messaging', roomId);
        await deleteDoc(docRef);
    }catch{}
};

export const fetchChats = (setChats, setLastVisible, Limit) => { 
    try{
        const docRef = query(collection(db, 'messaging'), where('member', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(docRef, async(snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setChats(await Promise.all(snap.docs.map(async(chat) => {
                const data = chat.data();
                const they = data.member[0]===auth.currentUser.uid?data.member[1]:data.member[0];
                return {
                    roomId: chat.id,
                    recipientId: they,
                    name: data[they].name, 
                    notification: data[they].notification, 
                    myNotification: data[auth.currentUser.uid].notification,
                    lastmessage: data.lastmessage,
                    lastmessageby: data.lastmessageby,
                    seen: data.seen,
                    timestamp: data?.timestamp?.toDate(),
                    element: data.element,
                    unread: data.unread,
                };
            })));
        });
        pushListeners(listener);
    }catch{}
};

export const fetchNextChats = async(setChats, lastVisible, setLastVisible, Limit) => {
    try{
        const docRef = query(collection(db, 'messaging'), where('member', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const snap = await getDocs(docRef);
        const LastVisible = snap.docs[snap.docs.length-1];
        setLastVisible(LastVisible);
        const newData = await Promise.all(snap.docs.map(async(chats) => {
            const data = chats.data();
            const they = data.member[0]===auth.currentUser.uid?data.member[1]:data.member[0];
            return {
                roomId: chats.id, 
                recipientId: they,
                name: data[they].name, 
                notification: data[they].notification, 
                myNotification: data[auth.currentUser.uid].notification,
                lastmessage: data.lastmessage,
                lastmessageby: data.lastmessageby,
                seen: data.seen,
                timestamp: data?.timestamp?.toDate(),
                element: data.element,
                unread: data.unread,
            };
        }))
        setChats(old => [...old, ...newData]);
    }catch{}
};