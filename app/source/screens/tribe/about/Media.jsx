import React from 'react';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import { reportFunc } from '../../../functions';
import { getMedia, getNextMedia } from './helper';
import { DeleteMessage } from '../messages/helper';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActionSheet, Back, EmptyState, ListItemWithIcon, Loader, ImageView } from '../../../components';

const limit = 10;
const { width } = Dimensions.get('window');

const options = {
    id: null,
    byme: null,
    msg: null,
};

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Media() {

    const navigation = useNavigation();
    const route = useRoute();
    const roomId = route.params?.roomId;

    const [array1, setArray1] = React.useState('_');
    const [open, setOpen] = React.useState(false);

    const handleOpen = React.useCallback(() => {
        setOpen(state => !state);
    }, [setOpen]);

    const delMedia = (id, url, me) => {
        options.id = id;
        options.byme = me;
        options.msg = url;
        setTimeout(() => {
            handleOpen();
        }, 100);
    };

    const nav = (uri, scontent) => {
        navigation.navigate('ImageView', { uri: uri, scontent: scontent });
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextMedia(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getMedia(roomId, setArray1, setLastVisible, limit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text60M textC1>Photos</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='photograph' 
        title='No photos' 
        type='fontisto'
        subtitle='See photos shared over here'/>
    ));

    const renderItem = React.useCallback(({item}) => (
        <ImageView 
        w={width*0.5}
        disablePadding
        uri={item.url}
        scontent={item.scontent}
        tap={() => nav(item.url, item.scontent)}
        onLongPress={() => delMedia(item.id, item.url, item.me)}/>
    ));

    const children = React.useMemo(() => (
        <View width={width} centerH>
            <View width={width*0.9} br40 bg-line>
                {options.byme?
                <ListItemWithIcon
                title='Delete'
                color={Colors.red}
                type='feather'
                icon='trash'
                onPress={() => {
                    DeleteMessage(roomId, options.id, 'image', options.msg).then(() => {
                        Toast.show({ text1: 'Your image was deleted' });
                    });
                    handleOpen();
                }}/> : null }
                { options.byme ? <View width={width*0.9} height={0.7} bg-bg2/> : null }
                <ListItemWithIcon
                title='Report'
                type='feather'
                color={Colors.red}
                icon='flag'
                onPress={() => {
                    handleOpen();
                    setTimeout(() => {
                        reportFunc(`/tribe/${roomId}/message/${options.id}`);
                    }, 100);
                }}/>
            </View>
        </View>
    ));

    const action = React.useMemo(() => (
        <ActionSheet 
        open={open} 
        close={handleOpen} 
        children={children}/>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        numColumns={2}
        estimatedItemSize={262}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex bg-bg1 useSafeArea>
            <View height={16}/>
            {array1.length===0?empty:body}
            {open?action:null}
        </View>

    );

};