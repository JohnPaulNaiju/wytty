import React from 'react';
import HomeScreen from './HomeScreen';
import { Platform } from 'react-native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { 
    EditProfile,
    OthersProfile, 
    MessageScreen,
    ChatDetails,
    CreateTribe,
    TribeDetails,
    Media,
    FolderScreen,
    MyPost,
    Cloud,
    Members,
    TribeInfo,
    DeleteAccount,
    Mention,
    Comment,
    How,
    CreateNote,
    Notes,
    NoteView,
    SearchTribe,
    CreatePoll,
    SendNote,
    SendFile,
    AddEmail,
    ContactUs,
    TribeFile,
    ProfileTribe,
    ProfilePost,
    Report,
    AboutWoint,
    Verification,
    CodeView,
    CreatePost,
    DPEditor,
    ImagePicker,
    PostView,
    TribeMain,
    ImageView,
    Search,
} from '../screens';

const Stack = createStackNavigator();
const isAndroid = Platform.OS==='android';

export default () => {

    const screenOptions = {
        headerShadowVisible: false, 
        ...TransitionPresets.SlideFromRightIOS,
        headerStyle: { backgroundColor: '#0F0F0F' }
    };

    return (

        <Stack.Navigator initialRouteName='HomeScreen' screenOptions={screenOptions}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Search" component={Search} options={{ animationEnabled: false }}/>
            <Stack.Screen name="Tribe" component={TribeMain}/>
            <Stack.Screen name="SearchTribe" component={SearchTribe}/>
            <Stack.Screen name="MessageScreen" component={MessageScreen}/>
            <Stack.Screen name="TribeDetails" component={TribeDetails} options={{ gestureEnabled: true, gestureDirection: 'horizontal' }}/>
            <Stack.Screen name="Media" component={Media}/>
            <Stack.Screen name="TribeFile" component={TribeFile}/>
            <Stack.Screen name="CreatePoll" component={CreatePoll}/>
            <Stack.Screen name="SendNote" component={SendNote}/>
            <Stack.Screen name="SendFile" component={SendFile}/>
            <Stack.Screen name="Cloud" component={Cloud}/>
            <Stack.Screen name="FolderScreen" component={FolderScreen}/>
            <Stack.Screen name="ChatDetails" component={ChatDetails}/>
            <Stack.Screen name="OthersProfile" component={OthersProfile}/>
            <Stack.Screen name="EditProfile" component={EditProfile}/>
            <Stack.Screen name="MyPost" component={MyPost}/>
            <Stack.Screen name="Members" component={Members}/>
            <Stack.Screen name="DeleteAccount" component={DeleteAccount}/>
            <Stack.Screen name="Mention" component={Mention}/>
            <Stack.Screen name="Comment" component={Comment}/>
            <Stack.Screen name="How" component={How}/>
            <Stack.Screen name="Note" component={Notes}/>
            <Stack.Screen name="CodeView" component={CodeView}/>
            <Stack.Screen name="CreateNote" component={CreateNote}/>
            <Stack.Screen name="NoteView" component={NoteView}/>
            <Stack.Screen name="AddEmail" component={AddEmail}/>
            <Stack.Screen name="ContactUs" component={ContactUs}/>
            <Stack.Screen name="ProfileTribe" component={ProfileTribe}/>
            <Stack.Screen name="ProfilePost" component={ProfilePost}/>
            <Stack.Screen name="Report" component={Report}/>
            <Stack.Screen name="AboutWoint" component={AboutWoint}/>
            <Stack.Screen name="Verification" component={Verification}/>
            <Stack.Screen name="DPEditor" component={DPEditor}/>
            <Stack.Screen name="PostView" component={PostView}/>
            <Stack.Screen name="ImageView" component={ImageView} options={{...TransitionPresets.ScaleFromCenterAndroid }}/>
            <Stack.Screen name="ImagePicker" component={ImagePicker} options={{...TransitionPresets?.[`${isAndroid?'BottomSheetAndroid':'ModalPresentationIOS'}`]}}/>
            <Stack.Screen name="CreatePost" component={CreatePost} options={{...TransitionPresets?.[`${isAndroid?'BottomSheetAndroid':'ModalPresentationIOS'}`]}}/>
            <Stack.Screen name="CreateTribe" component={CreateTribe} options={{...TransitionPresets?.[`${isAndroid?'BottomSheetAndroid':'ModalPresentationIOS'}`]}}/>
            <Stack.Screen name="TribeInfo" component={TribeInfo} options={{...TransitionPresets?.[`${isAndroid?'BottomSheetAndroid':'ModalPresentationIOS'}`]}}/>
        </Stack.Navigator>

    );

};