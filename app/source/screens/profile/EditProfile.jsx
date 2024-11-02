import React from 'react';
import { Image } from 'expo-image';
import { auth, db } from '../../hooks';
import { regex } from '../../functions';
import Toast from 'react-native-toast-message';
import { doc, updateDoc } from 'firebase/firestore';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, Icon, Input, ListItemWithIcon, Loader } from '../../components';
import { View, Text, Colors, TouchableOpacity, KeyboardAwareScrollView } from 'react-native-ui-lib';

export default function EditProfile() {

    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params;

    const [updating, setUpdating] = React.useState(false);

    const [change, setChange] = React.useState({
        name: data?.name || '',
        bio: data?.bio || '',
        link: data?.link || '',
    });

    const [isValid, setIsValid] = React.useState({ 
        name: (regex.name.test(change.name)||change.name.trim().length<1), 
        link: (regex.link.test(change.link)||change.link.trim().length<1), 
    });

    const handleChange = React.useCallback((value) => {
        setChange((state) => ({ 
            ...state, 
            ...value 
        }));
    }, [setChange]);

    const updateProfile = async(change) => {
        const userData = {
            name: change?.name?.trim(),
            bio: change?.bio?.trim(),
            link: change?.link?.trim(),
        };
        setUpdating((state) => !state);
        const docRef = doc(db, 'user', auth.currentUser.uid);
        await updateDoc(docRef, userData).then(() => {
            Toast.show({ text1: 'Your profile was updated' });
            navigation.goBack();
        }).catch(() => {
            setUpdating((state) => !state);
            Toast.show({ text1: 'Cannot process your request' });
        });
    };

    const pickDp = () => {
        navigation.navigate('ImagePicker', { ...route.params, from: 'EditProfile', type: 'photo' });
    };

    const validateBeforeUpdate = React.useCallback((change) => {
        const IF1 = (change.name!==data?.name)&&(change.name!==change.name?.trim()?.length<1);
        const IF2 = (change.link!==data?.link)&&(change.link!==change.link?.trim()?.length<1);
        const IF3 = (change.bio!==data?.bio)&&(change.bio!==change.bio?.trim()?.length<1);
        const IFF = IF1||IF2||IF3;
        if(IFF) updateProfile(change);
        else navigation.goBack();
    }, [change]);

    React.useEffect(() => {
        const fileURL = route.params?.fileURL;
        if(fileURL) setTimeout(() => navigation.navigate('DPEditor', { dplink: fileURL }), 500);
    }, [route.params]);

    React.useEffect(() => {
        setIsValid((state) => ({
            ...state, 
            name: (regex.name.test(change.name)||change.name.trim().length<1), 
            link: (regex.link.test(change.link)||change.link.trim().length<1), 
        }));
    }, [change, setIsValid]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>Edit Pɾofile</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                <View center marginR-22>
                    {updating?
                    <View height={40} center>
                        <Loader size={40}/>
                    </View> :
                    <View>
                        { Object.values(isValid).includes(false) ? null: 
                        <TouchableOpacity padding-6 onPress={() => validateBeforeUpdate(change)}>
                            <Icon name="done"/>
                        </TouchableOpacity> }
                    </View> }
                </View>
            )
        });
    }, [navigation, isValid, updating, change]);

    return (

        <View useSafeArea flex bg-bg1 centerH>
            
            <KeyboardAwareScrollView  contentContainerStyle={{ flex: 1, alignItems: 'center' }}>

                <View marginT-26 centerH>
                    <TouchableOpacity onPress={pickDp}>
                        <View width={84} height={84} center>
                            <Image 
                            placeholderContentFit='contain' 
                            placeholder='https://shorturl.at/PQTW4' 
                            recyclingKey={auth.currentUser.photoURL} 
                            source={{ uri: auth.currentUser.photoURL }} 
                            style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.bg2 }}/>
                            <View absH absV center br100 width={84} height={84} style={{ borderWidth: 2, borderColor: Colors.textC1 }}>
                                <Icon name='camera-plus-outline' type='material-community' size={32}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <Input
                len={30}
                marginT-26
                placeholder="Name"
                val={change.name}
                valid={(isValid.name)}
                notValid={(!isValid.name)}
                onChange={ e => handleChange({ name: e }) }/>

                <Input
                len={150}
                marginT-16
                paddingV-6
                placeholder="Bio"
                val={change.bio}
                multi
                onChange={ e => handleChange({ bio: e }) }/>

                <Input 
                len={75} 
                marginT-16
                val={change.link}
                placeholder="Link"
                valid={(isValid.link)}
                notValid={(!isValid.link)}
                onChange={ e => handleChange({ link: e }) }/>

                <ListItemWithIcon
                marginT-16
                icon='mail'
                type='feather'
                title='Register a back-up email'
                subtitle='Helpful for account recovery & security purposes'
                onPress={() => navigation.navigate('AddEmail')}/>

                <View height={100}/>

            </KeyboardAwareScrollView>
        </View>

    );

};