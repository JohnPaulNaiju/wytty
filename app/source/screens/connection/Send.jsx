import React from 'react';
import { UnRequest } from '../profile/helper';
import { getNextSend, getSend } from './helper2';
import { RefreshControl, FlatList } from 'react-native';
import { Colors, TouchableOpacity, View } from 'react-native-ui-lib';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { EmptyState, ListItemWithAvatar, Icon, Skeleton } from '../../components';

const limit = 15;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const Send = () => {

    const navigation = useNavigation();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [array1, setArray1] = React.useState('_');
    const [toggle, setToggle] = React.useState(true);

    const remove = (i) => {
        try{
            setArray1((prev) => {
                const newArr = [...prev];
                const profile = newArr[i];
                UnRequest(profile.id);
                newArr.splice(i, 1);
                return newArr;
            });
        }catch{}
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextSend(setArray1, lastVisible, setLastVisible, limit);
        }
    };

    const get = React.useCallback(async() => {
        setToggle((state) => !state);
        await getSend(setArray1, setLastVisible, limit);
        setToggle((state) => !state);
    }, [setArray1, setToggle]);

    React.useEffect(() => {
        get();
    }, []);

    const onPress = (name, id) => {
        navigation.navigate('OthersProfile', {
            username: name,
            id: id
        });
    };

    const renderItem = React.useCallback(({item, index}) => (
        <ListItemWithAvatar 
        title={item.name} 
        url={item.dp} 
        subtitle='Requested' 
        onPress={() => onPress(item.name, item.id)}
        right={
            <TouchableOpacity onPress={() => remove(index)}>
                <Icon name='trash' type='feather'/>
            </TouchableOpacity>
        }/>
    ));

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='user-friends' 
        type='font-awesome' 
        title='No requests send' 
        subtitle="You haven't send any connection request"
        btTitle='Check'
        onPress={get}/>
    ));

    const body = React.useMemo(() => (
        <FlatList
        data={array1}
        ref={scrollRef}
        renderItem={renderItem}
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

export default React.memo(Send);