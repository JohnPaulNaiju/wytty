import React from 'react';
import History from './History';
import { auth } from '../../hooks';
import { getNextUsers, getUsers } from './helper';
import { View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { Icon, ListItemWithAvatar } from '../../components';
import { formatNumber, recentSearch } from '../../functions';
import { ActivityIndicator, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const limit = 10;

const { enqueueSearch } = recentSearch;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const UserSearch = ({searchTerm}) => {

    const navigation = useNavigation();

    const [array1, setArray1] = React.useState('_');

    const [state, setState] = React.useState({
        loading: false,
        noresult: false,
    });

    const handleChange = React.useCallback((value) => {
        setState((state) => ({ ...state, ...value }));
    }, [setState]);

    const nav = (id, username) => {
        if(id===auth.currentUser.uid) return;
        enqueueSearch(id, username);
        navigation.navigate('OthersProfile', {
            username: username,
            id: id,
        });
    };

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextUsers(setArray1, searchTerm, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        if(searchTerm?.trim().length>0){
            handleChange({ loading: true, noresult: false });
            const delayDebounceFn = setTimeout(() => {
                const term = searchTerm?.toLowerCase();
                getUsers(setArray1, term, handleChange, setLastVisible, limit);
            }, 2000);
            return () => clearTimeout(delayDebounceFn);
        }else handleChange({ loading: false, noresult: false });
    }, [searchTerm]);

    const renderItem = React.useCallback(({item}) => (
        <ListItemWithAvatar 
        url={item?.dp} 
        title={item?.username} 
        verified={item?.verified} 
        onPress={() => nav(item?.id, item?.username)}
        subtitle={`${item?.name || ''}${(item?.name&&item?.bio)?' • ':''}${item?.bio || ''}`}
        right={
            <View row centerV br60 paddingH-6 paddingV-4 bg-green>
                <View padding-3 br40 bg-white>
                    <Icon name='fire' type='font-awesome' size={12} color={Colors.bg1}/>
                </View>
                <Text bg1 text90 marginL-4 style={{ fontWeight: 'bold' }}>{formatNumber(item?.woint||0)} WP</Text>
            </View>
        }/>
    ));

    return (

        <View flex bg-bg1 useSafeArea>
            <View width={width} center marginT-16>
                {state.loading?<ActivityIndicator size='small' color={Colors.textC2}/>:null}
                {state.noresult?<Text textC2 text80R>No accounts found</Text>:null}
            </View>
            {searchTerm?.trim().length===0?<History/>:null}
            <FlatList
            renderItem={renderItem}
            onEndReachedThreshold={0.75}
            keyExtractor={(i,x) => x}
            onEndReached={onEndReached}
            data={array1==="_"?[]:array1}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};

export default React.memo(UserSearch);