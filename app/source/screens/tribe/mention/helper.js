import { auth, db } from "../../../hooks";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export const getMentions = async(roomId, setMentions, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('replyingto', '==', auth.currentUser.displayName), where('by', '!=', auth.currentUser.uid), orderBy('by'), orderBy('timestamp', 'desc'), limit(Limit));
        const docRef = await getDocs(Query);
        const lastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(lastVisible);
        setMentions(docRef.docs.map((msg) => {
            const data = msg.data();
            return {
                id: msg.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.element==='text' && { message: data.message },
                ...data.element==='image' && { imageUrl: data.imageUrl }, 
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
            };
        }));
    }catch{}
};

export const getNextMentions = async(roomId, setMentions, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'tribe', roomId, 'message'), where('replyingto', '==', auth.currentUser.displayName), where('by', '!=', auth.currentUser.uid), orderBy('by'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        setMentions(docRef.docs.map((msg) => {
            const data = msg.data();
            return {
                id: msg.id,
                by: data.by,
                name: data.name,
                element: data.element,
                timestamp: data.timestamp?.toDate(),
                ...data.element==='text' && { message: data.message },
                ...data.element==='image' && { imageUrl: data.imageUrl }, 
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
            };
        }));
    }catch{}
};