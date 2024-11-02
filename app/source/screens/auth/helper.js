import { auth, db } from '../../hooks';
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';
import { sendNotification, storeAccounts } from '../../functions';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const LogInSessions = async() => {
    try{
        const title = auth.currentUser.displayName;
        const uid = auth.currentUser.uid;
        const msg = `New login on ${Constants.deviceName}`;
        const route = 'login';
        await sendNotification(true, true, false, uid, null, title, msg, route, null, null, null);
    }catch{}
};

export const RegisterUser = async(data, setLoading) => {
    try{
        const username = data.username?.toLowerCase()?.trim();
        const email = username+'@wytty.org';
        const passwd = data.password?.trim();

        await createUserWithEmailAndPassword(auth, email, passwd).then(async() => {

            const data = {
                id: auth.currentUser.uid,
                email: null,
            };

            const localData = {
                displayName: username,
                photoURL: 'https://shorturl.at/PQTW4',
            };

            const profileData = {
                uid: auth.currentUser.uid,
                username: username,
                dplink: 'https://shorturl.at/PQTW4',
                email: null,
                verified: false,
                tribe: 0,
                woint: 1,
                connection: 0,
                storageused: 0,
                storage: 1000,
                link: null,
                bio: 'Finding my tribe on Wყƚƚყ',
                name: null,
                token: null,
                interests: [],
                tribeId: [],
                connectionId: [],
                dob: serverTimestamp(),
                joined: serverTimestamp(),
                lastChanged: serverTimestamp(),
                lastClaimed: serverTimestamp(),
            };

            const usernameDocRef = doc(db, 'username', username);
            const userDocRef = doc(db, 'user', auth.currentUser.uid);

            setDoc(usernameDocRef, data);
            await setDoc(userDocRef, profileData);
            await updateProfile(auth.currentUser, localData);
            storeAccounts(username, passwd, auth.currentUser.uid, email);

            setLoading(false);

        }).catch((e) => {
            setLoading(false);
            const errorMessage = e?.code?.replace(/auth\/|-/g, ' ')?.trim();
            switch(errorMessage){
                case 'email already in use':
                    Toast.show({ text1: 'Username already in use' });
                    return;
                case 'invalid email':
                    Toast.show({ text1: 'Invalid username' });
                    return;
                case 'invalid password':
                    Toast.show({ text1: 'Invalid password' });
                    return;
                case 'too many requests':
                    Toast.show({ text1: 'Too many requests at the moment. Please try again later.' });
                    return;
                default:
                    Toast.show({ text1: errorMessage });
            }
        });
    }catch{
        Toast.show({ text1: 'Cannot process your request' });
        setLoading(false);
    }
};

export const LoginUser = async(data, handleUtil) => {
    try{
        const username = data.username?.toLowerCase()?.trim();
        const passwd = data.password?.trim();

        const docRef = doc(db, 'username', username);
        const ref = await getDoc(docRef);

        if(ref.exists()){
            const email = ref.data().email?ref.data().email:username+'@wytty.org';

            await signInWithEmailAndPassword(auth, email, passwd).then(async() => {
                await storeAccounts(username, passwd, auth.currentUser.uid, email);
                LogInSessions();
                handleUtil({ loading: false });
            }).catch((e) => {
                handleUtil({ loading: false });
                const errorMessage = e?.code?.replace(/auth\/|-/g, ' ')?.trim();
                switch(errorMessage){
                    case 'invalid email':
                        Toast.show({ text1: 'Invalid username' });
                        return;
                    case 'invalid password':
                        Toast.show({ text1: 'Wrong password' });
                        return;
                    case 'too many requests':
                        Toast.show({ text1: 'Too many requests at the moment. Please try again later.' });
                        return;
                    case 'user disabled':
                        Toast.show({ text1: 'Account disabled' });
                        return;
                    case 'user not found':
                        Toast.show({ text1: 'Account not found' });
                        return;
                    default:
                        Toast.show({ text1: errorMessage });
                }
            });
        }else{
            Toast.show({ text1: 'Account not found' });
        }
    }catch{
        Toast.show({ text1: 'Cannot process your request' });
        handleUtil({ loading: false });
    }
};

export const getUsername = async(name) => {
    try{
        const string = name?.trim();
        const docRef = doc(db, 'username', string);
        const ref = await getDoc(docRef);
        return ref.exists();
    }catch{
        return false;
    }
};

export const findAccount = async(username) => {
    try{
        const string = username?.trim();
        const docRef = doc(db, 'username', string);
        const ref = await getDoc(docRef);
        if(ref.exists()) return { ...ref.data() };
        else return false;
    }catch{}
};