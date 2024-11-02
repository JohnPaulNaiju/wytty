import React from 'react';
import { auth } from '../../../hooks';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { copyText, formatNumber, timeAgo } from '../../../functions';
import { DismissAdmin, getMembers, getNextMembers, makeAdmin } from './helper';
import { Back, EmptyState, ListItemWithAvatar, Loader, Alert } from '../../../components';

const limit = 15;

const options = {
    id: null,
    byme: null,
    element: null,
};

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Members() {

    const navigation = useNavigation();
    const route = useRoute();

    const { title, roomId, meAdmin, population, owner } = route.params;

    const [array1, setArray1] = React.useState('_');
    const [open, setOpen] = React.useState(false);

    const handleOpen = React.useCallback(() => {
        setOpen(state => !state);
    }, [setOpen]);

    const onPress = (name, id) => {
        if(id===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', {
            username: name,
            id: id,
        });
    };

    const onLongPress = (id, name, isadmin) => {
        options.id = id;
        options.byme = name;
        options.element = isadmin;
        setTimeout(() => {
            handleOpen();
        }, 100);
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextMembers(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getMembers(roomId, setArray1, setLastVisible, limit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View>
                    <Text textC1 text60>{title}</Text>
                    <Text textC2 text70R>{formatNumber(population)} Members</Text>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const renderItem = React.useCallback(({item}) => (
        <ListItemWithAvatar
        title={item.name}
        subtitle={`Member since ${timeAgo(item.joined)}`}
        url={item.dp}
        right={item.admin?
            <View br20 paddingH-6 paddingV-4 
            backgroundColor={item.owner?Colors.primary:Colors.textC1+'1f'}>
                <Text text80R textC1>{item.owner?'Creator':'Admin'}</Text>
            </View> : null
        }
        onLongPress={() => {
            if(meAdmin&&!item.admin){
                if(item.name!==auth.currentUser.displayName){
                    onLongPress(item.id, item.name, false);
                }
            }else if(owner&&item.admin){
                if(item.name!==auth.currentUser.displayName){
                    onLongPress(item.id, item.name, true);
                }
            }
        }}
        onPress={() => onPress(item.name, item.id)}/>
    ));

    const empty = React.useMemo(() => (
        <EmptyState 
        title='No members' 
        subtitle='Ask your friends to join by sharing tribe Id'
        btTitle='Copy Tride Id'
        onPress={() => copyText(roomId)}/>
    ));

    const alerts = React.useMemo(() => (
        <React.Fragment>
            <Alert
            open={open}
            close={handleOpen}
            showCancel
            title={options.element?'Dismiss as admin':'Make tribe admin'}
            subtitle={options.element?'Dismiss this user from admin':'Promote this user as admin'}
            options={[
                {
                    color: options.element?Colors.red:Colors.primary,
                    text: options.element?'Dismiss':'Make admin',
                    onPress: () => {
                        if(options.element){
                            DismissAdmin(roomId, options.id).catch(() => {
                                Toast.show({ text1: 'Cannot process your request' });
                                return;
                            });
                            Toast.show({ text1: 'Dismissed user as admin' });
                        }else{
                            const name = options.byme;
                            makeAdmin(roomId, options.id, `You are now admin of ${title} tribe`, options.byme).catch(() => {
                                Toast.show({ text1: 'Cannot process your request' });
                                return;
                            });
                            Toast.show({ text1: `${name} is now admin` });
                        }
                    }
                }
            ]}/>
        </React.Fragment>
    ));

    const body = React.useMemo(() => (
        <FlatList
        data={array1}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            
            {array1.length===0?empty:body}
            {alerts}
        </View>

    );

};