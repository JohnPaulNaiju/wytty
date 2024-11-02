import { Alert } from "react-native";
import { doc, updateDoc } from 'firebase/firestore';

const spamMessage = {
    lastActionTimestamp: new Date(),
    averageRelaxationTime: 2000,
    supiciousCount: 0,
    supiciousThreshold: 20,
    BotThreshold: 10,
    botCount: 0,
};

const spamPost = {
    lastActionTimestamp: new Date(),
    averageRelaxationTime: 40000,
    supiciousCount: 0,
    supiciousThreshold: 5,
    BotThreshold: 5,
    botCount: 0,
};

const labelAsBot = async() => {
    const fs = require('../hooks/useData');
    try{

        const data = {
            bot: true,
        };

        const userRef = doc(fs.db, 'user', fs.auth.currentUser.uid);
        await updateDoc(userRef, data);
    }catch{}
};

export const detectSpamMessage = () => {
    try{
        const lastActionTimestamp = spamMessage.lastActionTimestamp;
        const currentTimestamp = new Date();
        const timeGap = currentTimestamp - lastActionTimestamp;
        const relaxationTime = spamMessage.averageRelaxationTime;
        spamMessage.lastActionTimestamp = currentTimestamp;
        if(timeGap<relaxationTime){
            spamMessage.supiciousCount++;
            const count = spamMessage.supiciousCount;
            const threshold = spamMessage.supiciousThreshold;
            if(count>=threshold){
                spamMessage.botCount++;
                const botThreshold = spamMessage.BotThreshold;
                const botCount = spamMessage.botCount;
                const diff = botThreshold-botCount;
                Alert.alert('Spamming detected', `If you receive this alert ${diff} more ${diff>1?'time':'times'} your account will be labeled as bot account and further actions will be taken.`);
                labelAsBot();
            }
        }
    }catch{}
};

export const detectSpamPost = () => {
    try{
        const lastActionTimestamp = spamPost.lastActionTimestamp;
        const currentTimestamp = new Date();
        const timeGap = currentTimestamp - lastActionTimestamp;
        const relaxationTime = spamPost.averageRelaxationTime;
        spamPost.lastActionTimestamp = currentTimestamp;
        if(timeGap<relaxationTime){
            spamPost.supiciousCount++;
            const count = spamPost.supiciousCount;
            const threshold = spamPost.supiciousThreshold;
            if(count>=threshold){
                spamPost.botCount++;
                const botThreshold = spamPost.BotThreshold;
                const botCount = spamPost.botCount;
                const diff = botThreshold-botCount;
                Alert.alert('Spamming detected', `If you receive this alert ${diff} more ${diff>1?'time':'times'} your account will be labeled as bot account and further actions will be taken.`);
                labelAsBot();
            }
        }
    }catch{}
};