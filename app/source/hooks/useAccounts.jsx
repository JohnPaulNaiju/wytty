import React from 'react';
import * as SecureStore from 'expo-secure-store';

const useAccounts = () => {

    const { getDp } = require('../functions');

    const [accounts, setAccounts] = React.useState([]);

    const getAccount = React.useCallback(async() => {
        const acc = await SecureStore.getItemAsync('acc');
        if(acc){
            const accs = JSON.parse(acc);
            setAccounts(await Promise.all(accs.map(async(item) => ({
                username: item?.username,
                email: item?.email,
                password: item?.password,
                uid: item?.uid,
                dp: await getDp(item?.uid),
            }))));
        }
    }, [setAccounts]);

    return { getAccount, setAccounts, accounts };

};

export default useAccounts;