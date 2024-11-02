import React from 'react';
import { FlatList } from 'react-native';
import { View } from 'react-native-ui-lib';
import { auth, useAccounts } from '../hooks';
import Toast from 'react-native-toast-message';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Icon, ActionSheet, Loader, ListItemWithIcon, ListItemWithAvatar } from '../components';

const SwitchAccount = ({open, close}) => {

    const { accounts, getAccount } = useAccounts();

    const signout = async() => {
        close();
        await auth.signOut().catch(() => {
            Toast.show({ text1: "Couldn't process your request" });
        });
    };

    const SwitchAcc = async(email, password, uid) => {
        close();
        if(uid===auth.currentUser.uid) return;
        Toast.show({ text1: "Switching accounts" });
        await signout();
        await signInWithEmailAndPassword(auth, email, password).catch(() => {
            Toast.show({ text1: "Unable to switch accounts" });
        });
    };

    React.useEffect(() => {
        getAccount();
    }, []);

    const renderItem = React.useCallback(({item}) => (
        <ListItemWithAvatar
        url={item?.dp}
        title={item?.username||"User"}
        subtitle='Account in this device'
        onPress={() => SwitchAcc(item?.email, item?.password, item?.uid)}
        right={<View height={60} width={80} center>
            {item?.uid===auth.currentUser.uid?<Icon name='check-circle' type='feather' size={16}/>:null}
        </View>}/>
    ));

    const Footer = React.useMemo(() => (
        <ListItemWithIcon
        icon='plus-circle'
        type='feather'
        title='Add or create account'
        onPress={signout}/>
    ));

    const empty = React.useMemo(() => (
        <View center height={100} width='100%'>
            <Loader size={50}/>
        </View>
    ));

    const children = React.useMemo(() => (
        <FlatList
        data={accounts}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        ListEmptyComponent={empty}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={accounts.length<10?Footer:null}/>
    ));

    return <ActionSheet open={open} close={close} children={children}/>;

};

export default React.memo(SwitchAccount);