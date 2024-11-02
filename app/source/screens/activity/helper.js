import { auth, db, pushListeners } from "../../hooks";
import { arrayRemove, collection, doc, getDocs, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";

const formatDate = (timestamp) => {
    const currentTimeStamp = timestamp?.toDateString();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    return currentTimeStamp===today.toDateString()?'Today':currentTimeStamp===yesterday.toDateString()?'Yesterday':currentTimeStamp;
};

export const fetchNotifications = (setNotifications, setLastVisible, Limit, lastChanged) => {
    try{
        const Query = query(collection(db, 'notification'), where('for', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (docs) => {
            const lastVisible = docs.docs[docs.docs.length-1];
            setLastVisible(lastVisible);
            const arr = [];
            docs.docs.map((doc) => {
                const mainTitle = formatDate(doc.data().timestamp?.toDate());
                arr.push({
                    title: mainTitle,
                    data: [],
                });
            });
            const uniqueArray = arr.filter((item, index, array) => {
                return array.findIndex(obj => obj.title === item.title) === index;
            });
            docs.docs.map((doc) => {
                const data = doc.data();
                const title = formatDate(data.timestamp?.toDate());
                for(let i = 0; i < uniqueArray.length; i++){
                    if(uniqueArray[i].title===title){
                        uniqueArray[i].data.push({
                            id: doc.id,
                            message: data.message,
                            route: data.route,
                            params: data.params,
                            func: data.func,
                            image: data.image || 'https://shorturl.at/PQTW4',
                        });
                        break;
                    }
                }
            });
            setNotifications(uniqueArray);
            arr.splice(0, arr.length);
        });
        pushListeners(listener);
    }catch{}
};

export const fetchNextNotifications = async(setNotifications, lastVisible, setLastVisible, Limit, lastChanged) => {
    try{
        const Query = query(collection(db, 'notification'), where('for', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const ref = await getDocs(Query);
        const LastVisible = ref.docs[ref.docs.length-1];
        setLastVisible(LastVisible);
        const arr = [];
        ref.docs.map((doc) => {
            arr.push({
                title: formatDate(doc.data().timestamp?.toDate()),
                data: [],
            });
        });
        const uniqueArray = arr.filter((item, index, array) => {
            return array.findIndex(obj => obj.title === item.title) === index;
        });
        ref.docs.map((doc) => {
            const data = doc.data();
            const title = formatDate(data.timestamp?.toDate());
            for(let i = 0; i < uniqueArray.length; i++){
                if(uniqueArray[i].title===title){
                    uniqueArray[i].data.push({
                        id: doc.id,
                        message: data.message,
                        route: data.route,
                        params: data.params,
                        func: data.func,
                        image: data.image || 'https://shorturl.at/PQTW4',
                    });
                    break;
                }
            }
        });
        setNotifications(old => [...old, ...uniqueArray]);
        arr.splice(0, arr.length);
    }catch{}
};

export const deleteNotification = async(id) => {
    try{
        const data = {
            for: arrayRemove(...[auth.currentUser.uid])
        };
        const docRef = doc(db, 'notification', id);
        await updateDoc(docRef, data);
    }catch{}
};