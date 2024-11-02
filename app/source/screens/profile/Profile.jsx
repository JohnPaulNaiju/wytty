import React from 'react';
import { Image } from 'expo-image';
import { Icon } from '../../components';
import { auth, useData } from '../../hooks';
import Settings from '../settings/Settings';
import { openLink, formatNumber } from '../../functions';
import { Dimensions, Platform, FlatList, Share } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const isAndroid = Platform.OS==='android';

export default function Profile() {

    const { profile } = useData();
    const navigation = useNavigation();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const invite = () => {
        Share.share({
            title: `Wყƚƚყ`,
            message: `Hey! Connect with me on Wყƚƚყ!\nhttps://wytty.org/profile/${auth.currentUser.uid}\n`,
            url: `https://wytty.org/profile/${auth.currentUser.uid}`
        });
    };

    const header = React.useMemo(() => (
        <View width={width}>
            <View row centerV padding-16 width={82}>
                <Image 
                placeholderContentFit='contain' 
                placeholder='https://shorturl.at/PQTW4' 
                recyclingKey={profile?.dplink || auth.currentUser.photoURL} 
                source={{ uri: profile?.dplink || auth.currentUser.photoURL }} 
                style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bg2 }}/>
                { profile?.verified ? 
                <View absT absR marginT-60>
                    <Icon name='verified' size={18}/>
                </View> : null }
            </View>
            <View paddingH-16>
                <View row centerV>
                    { profile?.name? <Text text60 textC1 marginR-12>{profile?.name}</Text> : null }
                    <View bg-bg2 padding-5 br60>
                        <Text textC2 text80R>@{auth.currentUser.displayName}</Text>
                    </View>
                </View>
                { profile?.bio ? <Text text70R textC2 marginT-4>{profile?.bio}</Text> : null }
                { profile?.link?
                <TouchableOpacity marginT-6 centerV row onPress={() => openLink(profile?.link)}>
                    <Icon name='link' size={18}/>
                    <Text textC1 marginL-6 center>{profile?.link}</Text>
                </TouchableOpacity> : null }
            </View>
            <View width={width*0.95} paddingH-8 row centerV>
                <TouchableOpacity padding-8>
                    <Text textC1 text80>{formatNumber(profile?.connection||0)} connections</Text>
                </TouchableOpacity>
                <TouchableOpacity padding-8>
                    <Text textC1 text80>{formatNumber(profile?.tribe||0)} tribes</Text>
                </TouchableOpacity>
            </View>
            <View width={width*0.95} row marginT-2>
                <TouchableOpacity onPress={() => {
                    requestAnimationFrame(() => {
                        navigation.navigate('AboutWoint');
                    });
                }}>
                    <View marginL-14 row centerV br60 paddingH-6 paddingV-4 bg-green>
                        <View padding-3 br40 bg-white>
                            <Icon name='fire' type='font-awesome' size={12} color={Colors.bg1}/>
                        </View>
                        <Text bg1 text90 marginL-6 style={{ fontWeight: 'bold' }}>{formatNumber(profile?.woint||0)} WP</Text>
                    </View>
                </TouchableOpacity>
                <View flex row centerV marginL-16>
                    <Icon name='shield-check' type='octicons' color={Colors.textC2} size={14}/>
                    <Text textC2 text90R marginL-6>{auth.currentUser.emailVerified?'Verified email':'Unverified email'}</Text>
                    { profile?.bot?
                    <View row centerV br60 bg-line paddingH-8 paddingV-6 marginL-10>
                        <Icon name='dependabot' type='octicons' color={Colors.textC2} size={16}/>
                        <Text textC2 text90R marginL-6>Bot account</Text>
                    </View>:null}
                </View>
            </View>
            <View width={width} row centerV spread paddingH-16 marginT-16>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('EditProfile', { data: profile });
                }}>
                    <View width={width*0.45} height={40} br30 center bg-bg1 style={{ borderWidth: 2, borderColor: Colors.bg2 }}>
                        <Text textC1 text70R>Edit Profile</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={invite}>
                    <View width={width*0.45} height={40} br30 center bg-bg1 style={{ borderWidth: 2, borderColor: Colors.bg2 }}>
                        <Text textC1 text70R>Share profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    ));

    const footer = React.useMemo(() => <Settings profile={profile}/>);

    return (

        <View useSafeArea flex bg-bg1 centerH paddingTop={isAndroid?40:10}>
            <FlatList
            ref={scrollRef}
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};