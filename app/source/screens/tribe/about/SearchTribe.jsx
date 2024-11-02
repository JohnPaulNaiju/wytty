//search messages in tribe

import React from 'react';
import { auth } from '../../../hooks';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { reportFunc } from '../../../functions';
import { gextNextMsg, searchMsg } from './search';
import { View, Colors } from 'react-native-ui-lib';
import { DeleteMessage } from '../messages/helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, Icon, Input, Menu, TMessage } from '../../../components';

const { width } = Dimensions.get('window');
const limit = 10;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function SearchTribe() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId } = route.params;

    const [text, setText] = React.useState('');
    const [asc, setAsc] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [msg, setMsg] = React.useState([]);

    const onSubmit = async(term) => {
        if(term?.trim()?.length===0) return;
        setLoading(state => !state);
        const searchTerm = term.toLowerCase();
        await searchMsg(roomId, searchTerm, setMsg, setLastVisible, limit, asc);
        setLoading(state => !state);
    };

    const onEndReached = () => {
        if(msg.length>=limit){
            const searchTerm = text.toLowerCase();
            gextNextMsg(roomId, searchTerm, setMsg, lastVisible, setLastVisible, limit, asc);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { height: 120 },
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <Input w={width*0.65} placeholder='Search...' type='search'
                val={text} loading={loading} onChange={e => setText(e)} submit={() => onSubmit(text)}/>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => (
                <Menu
                options={[
                    {
                        text: 'Sort by time',
                        icon: 'time',
                        color: Colors.textC1,
                        type: 'ion',
                        onPress: () => {}
                    },
                    {
                        text: 'Old',
                        icon: 'sort-alphabetical-ascending',
                        color: asc?Colors.primary:Colors.textC1,
                        type: 'material-community',
                        onPress: () => setAsc(true),
                    },
                    {
                        text: 'New',
                        icon: 'sort-alphabetical-descending',
                        color: asc?Colors.textC1:Colors.primary,
                        type: 'material-community',
                        onPress: () => setAsc(false),
                    },
                ]}
                children={
                    <View width={width*0.15} center>
                        <Icon name='filter' type='feather'/>
                    </View>
                }/>
            ),
        });
    }, [navigation, asc, text, loading]);

    const renderItem = React.useCallback(({item}) => (
        <Menu
        triggerOnLongPress
        options={[
            {
                icon: item.by===auth.currentUser.uid?'trash':'flag',
                text: item.by===auth.currentUser.uid?'Delete':'Report',
                color: Colors.red,
                type: 'feather',
                onPress: () => {
                    if(item.by===auth.currentUser.uid) DeleteMessage(roomId, item.id, item.message || item.imageUrl);
                    else reportFunc(`/tribe/${roomId}/message/${item.id}`);
                }
            }
        ]}
        children={
            <TMessage 
            allDetails
            {...item}/>
        }/>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            <FlashList
            data={msg}
            estimatedItemSize={100}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};