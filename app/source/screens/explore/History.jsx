import React from 'react';
import { auth } from '../../hooks';
import { FlatList } from 'react-native';
import { recentSearch } from '../../functions';
import { useNavigation } from '@react-navigation/native';
import { ListItemWithAvatar, Icon } from '../../components';
import { View, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { dequeueSearch, getRecentSearch } = recentSearch;

const History = () => {

    const navigation = useNavigation();

    const [array1, setArray1] = React.useState('_');

    const nav = (id, username) => {
        if(id===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', {
            username: username,
            id: id,
        });
    };

    const deleteSearch = (i) => {
        dequeueSearch(i, setArray1);
    };

    React.useEffect(() => {
        getRecentSearch(setArray1);
    }, []);

    const renderItem = React.useCallback(({item, index}) => (
        <ListItemWithAvatar
        title={item.username}
        subtitle='Recently searched'
        url={item.dp}
        onPress={() => nav(item?.id, item?.username)}
        right={
            <TouchableOpacity onPress={() => deleteSearch(index)}>
                <Icon name='close' color={Colors.textC2} size={18}/>
            </TouchableOpacity>
        }/>
    ));

    return (

        <View>
            <FlatList
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            data={array1==="_"?[]:array1}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};

export default React.memo(History);