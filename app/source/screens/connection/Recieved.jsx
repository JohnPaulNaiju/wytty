import React from 'react';
import { Image } from 'expo-image';
import { limits, useData } from '../../hooks';
import Toast from 'react-native-toast-message';
import { CreateChat, getRoomId } from './helper';
import { EmptyState, Skeleton } from '../../components';
import { getNextRecieved, getRecieved } from './helper2';
import { Connect, rejectRequest } from '../profile/helper';
import { Dimensions, RefreshControl, FlatList } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { Colors, TouchableOpacity, View, Text, Drawer } from 'react-native-ui-lib';

const limit = 15;
const { width } = Dimensions.get('window');
const { cLimit } = limits;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const Recieved = () => {

    const navigation = useNavigation();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [array1, setArray1] = React.useState('_');
    const [toggle, setToggle] = React.useState(true);

    const { profile } = useData();

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextRecieved(setArray1, lastVisible, setLastVisible, limit);
        }
    };

    const connect = (i) => {
        if(profile?.connection>=cLimit){
            Toast.show({ text1: `You can have only ${cLimit} connections` });
            return;
        }
        setArray1((prev) => {
            const newArr = [...prev];
            const profile = newArr[i];
            profile.connected = true;
            Connect(profile.id, profile.name, null);
            const roomId = getRoomId(profile.id);
            CreateChat(roomId, profile.id, profile.name);
            return newArr;
        });
    };

    const remove = (i) => {
        try{
            setArray1((prev) => {
                const newArr = [...prev];
                const profile = newArr[i];
                rejectRequest(profile.id);
                newArr.splice(i, 1);
                return newArr;
            });
        }catch{}
    };

    const get = React.useCallback(async() => {
        setToggle((state) => !state);
        await getRecieved(setArray1, setLastVisible, limit);
        setToggle((state) => !state);
    }, [setArray1, setToggle]);

    const onPress = (name, id) => {
        navigation.navigate('OthersProfile', {
            username: name,
            id: id
        });
    };

    React.useEffect(() => {
        get();
    }, []);

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='user-friends' 
        type='font-awesome' 
        title='No requests' 
        subtitle="You haven't received any connection request"
        btTitle='Check'
        onPress={get}/>
    ));

    const renderItem2 = React.useCallback(({item, index}) => (
        <View marginT-16>
            <Drawer rightItems={[{ text: 'Decline', background: Colors.red, onPress: () => remove(index) }]}>
                <View bg-bg1 row centerV width={width} height={60}>
                    <View width={60} height={60} center>
                        <Image source={{ uri: item.dp }} recyclingKey={item.dp} style={{ width: 44, height: 44, borderRadius: 26, backgroundColor: Colors.bg2 }} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain'/>
                    </View>
                    <View height={60} flex paddingR-16 paddingL-6 centerV>
                        <TouchableOpacity onPress={() => onPress(item.name, item.id)}>
                            <Text textC1 text70R numberOfLines={1} style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View row centerV paddingR-16 spread height={60}>
                        {item.connected?
                        <View paddingH-12 paddingV-4 br30 style={{ borderWidth: 1, borderColor: Colors.bg2 }}>
                            <Text textC1 text70R>Connected</Text>
                        </View>
                        :
                        <TouchableOpacity onPress={() => connect(index)}>
                            <View paddingH-12 paddingV-4 br30 bg-primary>
                                <Text textC1 text70R>Accept</Text>
                            </View>
                        </TouchableOpacity>}
                    </View>
                </View>
            </Drawer>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlatList
        data={array1}
        ref={scrollRef}
        renderItem={renderItem2}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={!toggle} onRefresh={get} tintColor={Colors.textC2} progressBackgroundColor={Colors.bg2} colors={[Colors.textC1]}/>}/>
    ));

    if(array1==='_') return <Skeleton type='chat'/>;

    return (

        <View flex>
            {array1.length===0?empty:body}
        </View>

    );

};

export default React.memo(Recieved);