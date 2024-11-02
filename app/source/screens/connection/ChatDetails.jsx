import React from 'react';
import { Image } from 'expo-image';
import { saveChatDetails } from './helper';
import { reportFunc } from '../../functions';
import Toast from 'react-native-toast-message';
import { Dimensions, FlatList } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Icon, ListItemWithIcon, Alert } from '../../components';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { View, Text, Colors, TouchableOpacity, Switch } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

export default function ChatDetails() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, recipientId, recipientUserName, recipientDp, notification } = route.params;

    const [index, setIndex] = React.useState(0);
    const [data, setData] = React.useState({
        notification: notification,
    });

    const handleChange = React.useCallback((value) => {
        setData((state) => ({ ...state, ...value }));
    }, [setData]);

    const save = async() => {
        Toast.show({ text1: 'Saving...' });
        saveChatDetails(roomId, data.notification);
        const popAction = StackActions.pop(2)
        navigation.dispatch(popAction);
        Toast.show({ text1: 'Saved 🎉' });
    };

    const open = (val) => {
        setIndex(val);
    };

    const close = () => {
        setIndex(0);
    };

    const goBack = () => {
        if(data.notification!==notification) open(1);
        else navigation.goBack();
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => null,
            headerRight: () => null,
            headerLeft: () => (
                <TouchableOpacity onPress={goBack}>
                    <View width={60} height={45} bg-bg2 center borderTopRightRadius={30} borderBottomRightRadius={30}>
                        <Icon name='chevron-left'/>
                    </View>
                </TouchableOpacity>
            ),
        });
    }, [navigation, data]);

    const alerts = React.useMemo(() => (
        <React.Fragment>
            <Alert
            title='Save changes'
            subtitle='Do you want to save the changes you made?'
            open={index===1}
            close={close}
            options={[
                {
                    text: 'Yes',
                    color: Colors.primary,
                    onPress: () => save()
                },
                {
                    text: 'No',
                    color: Colors.textC1,
                    onPress: () => navigation.goBack()
                }
            ]}/>
            <Alert
            title='Report conversation'
            subtitle='Report this conversation'
            open={index===2}
            close={close}
            showCancel
            options={[
                {
                    text: 'Yes',
                    color: Colors.red,
                    onPress: () => reportFunc(`/messaging/${roomId}`)
                },
            ]}/>
        </React.Fragment>
    ));

    const header = React.useMemo(() => (
        <View width={width} centerH>
            <View width={width} height={160} center marginT-16>
                <Image 
                recyclingKey={recipientDp} 
                source={{ uri: recipientDp }} 
                placeholderContentFit='contain' 
                placeholder='https://shorturl.at/PQTW4' 
                style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.bg2 }}/>
                <Text textC1 text50 marginT-16>{recipientUserName}</Text>
            </View>

            <View width={width} height={6} bg-bg2 marginB-16 marginT-50/>

            <ListItemWithIcon 
            onPress={() => {
                navigation.navigate('OthersProfile', {
                    username: recipientUserName,
                    id: recipientId,
                });
            }}
            title={recipientUserName} 
            icon='account' 
            type='material-community'
            right={<Icon name='chevron-right'/>}/>

            <ListItemWithIcon 
            title='Notifications'
            icon='notifications'
            right={<Switch onColor={Colors.primary} value={data.notification} onValueChange={(e) => handleChange({ notification: e })}/>}/>

            <View width={width} height={6} bg-bg2 marginT-16 marginB-6/>

            <ListItemWithIcon onPress={() => open(2)} title='Report' icon='report' color={Colors.red}/>

        </View>
    ));

    return (

        <View flex bg-bg1 centerH useSafeArea>
            
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={100}/>}/>
            {alerts}
        </View>

    );

};