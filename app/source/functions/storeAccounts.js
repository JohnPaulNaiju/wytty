import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

export const storeAccounts = async(username, password, uid, email) => {
    let newArr = [];
    try{
        const PushDatas = async() => {
            newArr.push({ 
                username: username, 
                email: email, 
                password: password, 
                uid: uid 
            });
            await SecureStore.setItemAsync('acc', JSON.stringify(newArr));
        }
        let result = await SecureStore.getItemAsync('acc');
        if(result){
            newArr = [...JSON.parse(result)];
            if(newArr.length>=10){
                Toast.show({ text1: 'You can have only upto 10 accounts per device' });
                return;
            }
            let found = false;
            for(let i = 0; i < newArr?.length; i++){
                if(newArr[i]?.username===username){
                    found = true;
                    newArr[i].email = email;
                    newArr[i].password = password;
                    newArr[i].uid = uid;
                    break;
                }
            }
            if(!found) PushDatas();
            else await SecureStore.setItemAsync('acc', JSON.stringify(newArr));
        }else PushDatas();
    }catch{}
};

export const removeAccount = async(index, accounts, setAccounts) => {
    let newArr = [];
    try{
        newArr = [...accounts];
        newArr.splice(index, 1);
        setAccounts(newArr);
        await SecureStore.setItemAsync('acc', JSON.stringify(newArr));
    }catch{
        setAccounts(accounts);
    }
}

export const getAccountData = async(uid) => {
    let newArr = [];
    let email, passwd;
    try{
        let result = await SecureStore.getItemAsync('acc');
        if(result){
            newArr = [...JSON.parse(result)];
            let found = false;
            for(let i = 0; i < newArr?.length; i++){
                if(newArr[i].uid===uid){
                    found = true;
                    email = newArr[i].email;
                    passwd = newArr[i].password;
                    break;
                }
            }
            if(!found) return null;
        }else return null;
        return { email, passwd };
    }catch{}
}