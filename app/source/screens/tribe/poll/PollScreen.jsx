import React from 'react';
import { auth } from '../../../hooks';
import { FlashList } from '@shopify/flash-list';
import { reportFunc } from '../../../functions';
import { getNextPolls, getPolls } from './helper';
import { View, Colors } from 'react-native-ui-lib';
import { DeleteMessage } from '../messages/helper';
import { EmptyState, Menu, PollBox, Skeleton } from '../../../components';

const limit = 10;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const PollScreen = ({roomId, unsubscribe}) => {

    const [array1, setArray1] = React.useState('_');

    const onEndReached = async() => {
        if(array1.length>=limit){
            await getNextPolls(roomId, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getPolls(roomId, setArray1, unsubscribe, setLastVisible, limit);
    }, [roomId]);

    const empty = React.useMemo(() => (
        <EmptyState 
        fullHeight 
        icon='ballot' 
        title='No Polls' 
        subtitle='Create your poll'/>
    ));

    const renderItem = React.useCallback(({item}) => (
        <Menu
        triggerOnLongPress
        options={[
            {
                text: item.by===auth.currentUser.uid?'Delete':'Report',
                icon: item.by===auth.currentUser.uid?'trash':'flag',
                type: 'feather',
                color: Colors.red,
                onPress: () => {
                    if(item.by===auth.currentUser.uid) DeleteMessage(roomId, item.id, null, null);
                    else reportFunc(`/tribe/${roomId}/poll/${item.id}`);
                }
            }
        ]}
        children={
            <PollBox
            fullWidth
            roomId={roomId}
            {...item}/>
        }/>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        estimatedItemSize={283}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Skeleton type='poll'/>;

    return (

        <View flex>
            {array1.length===0?empty:body}
        </View>

    );

};

export default React.memo(PollScreen);