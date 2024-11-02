import Toast from "react-native-toast-message";
import { summarizeText } from "../../functions";
import { db, auth, pushListeners } from "../../hooks";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, where } from "firebase/firestore";

export const getNotebooks = async(setArray1, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'note'), where('editors', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), limit(Limit));
        const listener = onSnapshot(Query, (snap) => {
            const lastVisible = snap.docs[snap.docs.length-1];
            setLastVisible(lastVisible);
            setArray1(snap.docs.map((note) => {
                const data = note.data();
                return {
                    id: note.id,
                    title: data.title,
                    timestamp: data.timestamp?.toDate(),
                    editors: data.editors,
                    editorsData: data.editorsData,
                    data: data.data,
                };
            }));
        });
        pushListeners(listener);
    }catch{}
};

export const getNextNotebooks = async(setArray1, lastVisible, setLastVisible, Limit) => {
    try{
        const Query = query(collection(db, 'note'), where('editors', 'array-contains', auth.currentUser.uid), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(Limit));
        const docRef = await getDocs(Query);
        const LastVisible = docRef.docs[docRef.docs.length-1];
        setLastVisible(LastVisible);
        const newData = docRef.docs.map((note) => {
            const data = note.data();
            return {
                id: note.id,
                title: data.title,
                timestamp: data.timestamp?.toDate(),
                editors: data.editors,
                editorsData: data.editorsData,
                data: data.data,
            };
        });
        setArray1(old => [...old, ...newData]);
    }catch{}
};

export const deleteNote = async(noteId) => {
    try{
        const docRef = doc(db, 'note', noteId);
        await deleteDoc(docRef);
    }catch{}
};

export const getNoteContent = async(noteId, setData) => {
    try{
        const noteRef = doc(db, 'note', noteId);
        const docRef = await getDoc(noteRef);
        const data = docRef.data();
        const Data = JSON.parse(data.data);
        setData({
            title: data.title,
            timestamp: data.timestamp?.toDate(),
            editors: data.editors,
            editorsData: data.editorsData,
            data: Data,
        });
    }catch{
        Toast.show({ text1: "Error! Note might be deleted or not shared by author", visibilityTime: 6000, autoHide: true });
    }
};

export const saveNote = async(noteId, data, title) => {
    try{
        if(noteId){

            const Data = {
                title: title?.trim(),
                searchTerm: title?.toLowerCase(),
                data: data,
                timestamp: serverTimestamp(),
            };
    
            const docRef = doc(db, 'note', noteId);
            await updateDoc(docRef, Data);
        }else{

            const Data = {
                title: title?.trim(),
                searchTerm: title?.toLowerCase(),
                timestamp: serverTimestamp(),
                editors: [auth.currentUser.uid],
                editorsData: [{ uid: auth.currentUser.uid, name: auth.currentUser.displayName }],
                data: data,
            };

            const docRef = collection(db, 'note');
            await addDoc(docRef, Data);
        }
    }catch{
        Toast.show({ text1: "Couldn't save note" });
    }
};

export const searchNote = async(title, setNotes, handleChange, Limit) => {
    try{
        const Query = query(collection(db, 'note'), where('searchTerm', '>=', title), where('searchTerm', '<=', title+'\uf8ff'), where('editors', 'array-contains', auth.currentUser.uid), limit(Limit));
        const docRef = await getDocs(Query);
        if(docRef.empty){
            handleChange({ loading: false });
            Toast.show({ text1: 'No results found' });
            return;
        }
        handleChange({ loading: false });
        setNotes(docRef.docs.map((note) => {
            const data = note.data();
            return {
                id: note.id,
                title: data.title,
                timestamp: data.timestamp?.toDate(),
                editors: data.editors,
                editorsData: data.editorsData,
                data: data.data,
            };
        }));
    }catch{}
};

export const summarizeNote = async(data) => {
    Toast.show({ 
        props: {
            type: 'bot',
            text: '',
        },
        type: 'dynamicIsland', 
        position: 'top', 
        autoHide: false, 
    });
    const msg = [];
    msg.push({ role: 'user', content: `Summarize this(by ingnoring all html attributes, tags etc): ${data}` });
    const summarizedText = await summarizeText(msg);
    Toast.show({ 
        props: {
            type: 'bot',
            text: summarizedText,
        },
        type: 'dynamicIsland', 
        position: 'top', 
        autoHide: false, 
    });
};

export const getMyFiles = async(setFiles, type) => {
    try{
        const arr = [];
        const Query = query(collection(db, 'user', auth.currentUser.uid, 'folder'), orderBy('timestamp', 'desc'));
        const docRef = await getDocs(Query);
        docRef.docs.map((file) => {
            const data = file.data();
            data?.files?.map((file) => {
                arr.push({
                    name: file.name,
                    url: file.url,
                    size: file.size,
                    mime: file.mime,
                });
            });
        });
        if(type==='image'){
            const types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/apng', 'image/avif', 'image/svg+xml'];
            setFiles(arr.filter((file) => types.includes(file.mime)));
        }else if(type==='video'){
            const types = ['video/mp4', 'video/webm', 'video/mov'];
            setFiles(arr.filter((file) => types.includes(file.mime)));
        }
        arr.splice(0, arr.length);
    }catch{}
};