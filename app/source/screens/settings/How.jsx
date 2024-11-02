import React from 'react';
import { Back } from '../../components';
import { limits, useData } from '../../hooks';
import { Dimensions, FlatList } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';

const { width } = Dimensions.get('window');
const { folderLimit, pTextLen, storage, textLen, tLimit, cLimit, nLimit, uTLimit } = limits;

export default function How() {

    const navigation = useNavigation();

    const profile = useData();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60M>How to use</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View width={width} paddingH-18 marginV-16>
            <Text text60 textC1>Tribes</Text>
            <Text text70R textC1 marginT-6>Wყƚƚყ is all about tribes. It is our word for community. You can join tribe of your interests and connect with like minded individuals. You can text, share post, conduct or take part in polls and share resources in tribes.</Text>
            <Text text70R textC1 marginT-6>NB:</Text>
            <Text text70R textC1 marginL-16>• You can currently only join/create {uTLimit} tribes.</Text>
            <Text text70R textC1 marginL-16>• In private tribe anyone with tribe Id can join tribe.</Text>
            <Text text70R textC1 marginL-16>• Files & Notes Category limit: 50</Text>
            <Text text70R textC1 marginL-16>• Current tribe member capacity: {tLimit}</Text>
            <Text text60 textC1 marginT-16>Woint</Text>
            <Text text70R textC1>Woint is a Ad revenue sharing mechanism for loyal users of Wყƚƚყ. When we start making revenue, the revenue made from ads will be shared with users with respect to their woints. Woints can be earned by:</Text>
            <Text text70R textC1 marginL-16>• +1 Signing in everyday for user less than 300 connections</Text>
            <Text text70R textC1 marginL-16>• +2 Signing in everyday for users with 300+ connections</Text>
            <Text text70R textC1 marginL-16>• +5 Each posted shared in public tribe</Text>
            <Text text70R textC1 marginL-16>• -5 Each post delete</Text>
            <Text text70R textC1 marginL-16>• -5 Each post delete</Text>
            <Text text80R textC2>Creators {"(verified users)"} will have 2X boost on ad revenue sharing. Constantly contribute to tribe to ger verified.</Text>
            {/* <Text text60 textC1 marginT-16>Explore and Discover</Text>
            <Text text70R textC1 marginT-6>Here you will see suggested tribes, accounts and posts. You can also search for tribes and people.</Text> */}
            <Text text60 textC1 marginT-16>Searching People</Text>
            <Text text70R textC1 marginT-6>When you search for a user, search using username.</Text>
            {/* <Text text60 textC1 marginT-16>Stɾeam</Text>
            <Text text70R textC1 marginT-6>Is a upcoming feature where you can start instant chat conversations with strangers.</Text> */}
            <Text text60 textC1 marginT-16>Wყƚƚყ Cloud</Text>
            <Text text70R textC1 marginT-6>If you want to share files with members in your tribe. First you will have to create a folder in Wყƚƚყ cloud and upload the file. Then you can share it with your tribe members.</Text>
            <Text text70R textC1 marginL-6>• Folder limit: {folderLimit} folders</Text>
            <Text text70R textC1 marginL-6>• Storage limit: {Math.round(profile?.storage || storage)/1000 || 1} GB</Text>
            <Text text60 textC1 marginT-16>Posts</Text>
            <Text text70R textC1 marginT-6>You can share your posts with the tribe members. Posts you shared in public tribe will be visible on your profile and others will be able to see it.</Text>
            <Text text60 textC1 marginT-16>Connections</Text>
            <Text text70R textC1 marginT-6>With connections you can connect with like minded people. You can only DM with connected people. At the moment Wყƚƚყ allows you to only have {cLimit} connections.</Text>
            <Text text60 textC1 marginT-16>Poll</Text>
            <Text text70R textC1 marginT-6 marginL-16>• Poll ends in 24 hour</Text>
            <Text text70R textC1 marginL-16>• Poll can have only upto 4 options</Text>
            <Text text70R textC1 marginL-16>• Question in poll is optional</Text>
            <Text text60 textC1 marginT-16>Notes</Text>
            <Text text70R textC1 marginT-6>Note is a simple way to convey huge information. Something that can't be conveyed through messages can be conveyed through notes, like asking doubt about a math/coding problem or provide a solution which might be big. All you have to do is, go to your profile, select notes and create a note. Create a content in note and copy the note Id by long pressing the note and you can share it with others by pasting it in messages.</Text>
            {/* <Text text70R textC1 marginL-16>• Notes limit: {nLimit} notes</Text> */}
            <Text text60 textC1 marginT-16>Upload Capacity</Text>
            <Text text70R textC1 marginT-6 marginL-16>• Profile picture: 1 MB</Text>
            <Text text70R textC1 marginL-16>• File: 1 GB Total</Text>
            <Text text70R textC1 marginL-16>• Image message: 5 MB</Text>
            <Text text70R textC1 marginL-16>• Tribe profile picture: 2 MB</Text>
            <Text text70R textC1 marginL-16>• Post image/video: 25 MB</Text>
            <Text text60 textC1 marginT-16>Text Limit</Text>
            <Text text70R textC1 marginT-6 marginL-16>• Message text: {textLen} letters</Text>
            <Text text70R textC1 marginL-16>• Post text: {pTextLen} letters</Text>
            <Text text70R textC1 marginL-16>• Tribe description: 500 letters</Text>
            <Text text60 textC1 marginT-16>Add account</Text>
            <Text text70R textC1 marginT-6>Long press your profile icon in bottom tabs to switch or add accounts. You can have upto 10 accounts per device.</Text>
            <Text text60 textC1 marginT-16>Notification</Text>
            <Text text70R textC1 marginT-6>If you aren't recieving notifications, go to settings and turn on notifications. If it is already on, turn it off and back on.</Text>
            <Text textC2 text70 marginT-16>Note: The limits set will be increased with increase in users.</Text>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={60}/>}/>
        </View>

    );

};