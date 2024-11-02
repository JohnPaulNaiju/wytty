import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";

export const createInvoice = async(amount, curr, product) => {
    const fs = require('../hooks/useData');
    try{
        const data = {
            amount: amount,
            curr: curr,
            product: product,
            timestamp: serverTimestamp(),
            status: 'pending',
        };
        const docRef = collection(fs.db, 'user', fs.auth.currentUser.uid, 'invoice');
        const ref = await addDoc(docRef, data);
        return ref.id;
    }catch{}
};

export const finalInvoice = async(docId, status) => {
    const fs = require('../hooks/useData');
    try{
        const data = {
            status: status, //canceled, failed, success
        };
        const docRef = doc(fs.db, 'user', fs.auth.currentUser.uid, 'invoice', docId);
        await updateDoc(docRef, data);
    }catch{}
};

