import { auth, db } from "../../../hooks";
import Toast from "react-native-toast-message";
import { reportFunc } from "../../../functions";
import { arrayRemove, doc, increment, updateDoc, serverTimestamp, getDoc, arrayUnion } from "firebase/firestore";

const kickOutUser = async(roomId, userId, isAdmin, isOwner) => {
    try{

        if(isOwner){
            Toast.show({ text1: 'Tribe creator cannot be kicked out' });
            return;
        }

        const tribeData = {
            member: arrayRemove(...[userId]),
            population: increment(-1),
        };

        const userData = {
            tribe: increment(-1),
            tribeId: arrayRemove(...[roomId]),
        };

        const userRef = doc(db, 'user', userId);
        const tribeRef = doc(db, 'tribe', roomId);

        updateDoc(userRef, userData);
        await updateDoc(tribeRef, tribeData);

        Toast.show({ text1: 'User kicked out! Thank you for keeping the community safe' });
    }catch{}
};

export const suspiciousUserReport = async(roomId, userId, population) => {
    try{

        Toast.show({ text1: 'Voted! Thank you for keeping the community safe' });

        const customNumReport = Math.sqrt(population);
        const roundedValue = Math.round(customNumReport);
        const customElapsedTime = population;

        const userRef = doc(db, 'tribe', roomId, 'member', userId);
        const userData = (await getDoc(userRef)).data();

        const isReporter = userData?.reporters?.includes(auth.currentUser.uid);
        if(isReporter) return;

        const lastReported = userData?.lastReported?.toDate() || 0;
        const currentTime = new Date();
        const timeElapsedMilliseconds = currentTime - lastReported;
        const secondsElapsed = Math.floor(timeElapsedMilliseconds / 1000);
        const minutesElapsed = Math.floor(secondsElapsed / 60);

        const numReports = userData?.numReport || 0;

        if(minutesElapsed<=customElapsedTime&&numReports>=roundedValue){
            const isAdmin = userData.meAdmin;
            const isOwner = userData.owner;
            kickOutUser(roomId, userId, isAdmin, isOwner);
            reportFunc(`/user/${userId}`, 'suspicious_activity');
            return;
        }

        const data = minutesElapsed>customElapsedTime?{
            lastReported: serverTimestamp(),
            reporters: [auth.currentUser.uid],
            numReport: 1,
        }:{
            lastReported: serverTimestamp(),
            reporters: arrayUnion(...[auth.currentUser.uid]),
            numReport: increment(1),
        };

        await updateDoc(userRef, data);

    }catch{}
};