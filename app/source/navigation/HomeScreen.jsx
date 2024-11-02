import React from 'react';
import { Image } from 'expo-image';
import { Icon } from '../components';
import { Platform } from 'react-native';
import { auth, useNotify } from '../hooks';
import SwitchAccount from './SwitchAccount';
import { updateNotify } from '../hooks/helper';
import { Colors, View } from 'react-native-ui-lib';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Activity, Profile, Connection, Explore } from '../screens';

const Tab = createBottomTabNavigator();
const isAndroid = Platform.OS==='android';

export default function HomeScreen(){

    const { notify, handleNotify } = useNotify();

    const [open, setOpen] = React.useState(false);

    const update = (val) => {
        if(val==='activity'){
            if(notify.activity){
                updateNotify();
                handleNotify({ activity: false });
            }
        }else if(val==='message'){
            handleNotify({ msg: false });
        }
    };

    const handleOpen = React.useCallback(() => {
        setOpen(state => !state);
    }, [setOpen]);

    const screenOptions = ({route}) => ({
        tabBarStyle: { 
            borderTopWidth: 0, 
            backgroundColor: Colors.bg1,
            elevation: 0,
            shadowOpacity: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.textC1,
        tabBarInactiveTintColor:Colors.icon,
        tabBarLabel : () => null,
        tabBarIcon: ({ focused, color, size }) => {
            focused ? size = 30 : size = 24;
            switch(route.name){
                case 'Home':
                    return (
                        <View centerH>
                            <Icon type='feather' name='triangle' size={size} color={color} style={{ marginTop: isAndroid?-8:0 }}/>
                            { notify.tribe>0 ? <View width={6} height={6} br20 bg-primary marginT-4/> : null }
                        </View>
                    );
                case 'Connection':
                    return (
                        <View centerH>
                            <Icon type='font-awesome' name='users' size={size} color={color} style={{ marginTop: isAndroid?-8:0 }}/>
                            { notify.msg ? <View width={6} height={6} br20 bg-primary marginT-4/> : null }
                        </View>
                    );
                case 'Explore':
                    return <Icon type='feather' name='search' size={size} color={color} style={{ marginTop: isAndroid?-8:0 }}/>;
                case 'Activity':
                    return (
                        <View centerH>
                            <Icon type='feather' name='activity' size={size} color={color} style={{ marginTop: isAndroid?-8:0 }}/>
                            { notify.activity ? <View width={6} height={6} br20 bg-primary marginT-4/> : null }
                        </View>
                    );
                case 'Profile':
                    return (
                        <View style={{ borderWidth: 2, borderColor: color }} width={size+4} height={size+4} borderRadius={size+4} center marginTop={isAndroid?-8:0}>
                            <Image 
                            placeholderContentFit='contain' 
                            placeholder='https://shorturl.at/PQTW4' 
                            recyclingKey={auth.currentUser.photoURL} 
                            source={{ uri: auth.currentUser.photoURL }} 
                            style={{ width: size-2, height: size-2, borderRadius: size, backgroundColor: Colors.bg2 }}/>
                        </View>
                    );
                default:
                    return null;
            }
        },
    });

    const accounstview = React.useMemo(() => (
        <SwitchAccount 
        open={open} 
        close={handleOpen}/>
    ));

    return (

        <View flex bg-bg1>
            <Tab.Navigator initialRouteName='Home' screenOptions={screenOptions}>
                <Tab.Screen name="Home" component={Home}/>
                <Tab.Screen name="Connection" component={Connection} listeners={{ tabPress: () => update('message')}}/>
                <Tab.Screen name="Explore" component={Explore}/>
                <Tab.Screen name="Activity" component={Activity} listeners={{ tabPress: () => update('activity')}}/>
                <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} listeners={{ tabLongPress: () => handleOpen()}}/>
            </Tab.Navigator>
            {open?accounstview:null}
        </View>

    );

};