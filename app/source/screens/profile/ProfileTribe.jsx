import React from 'react';
import { FlatList } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { getNextUserTribe, getUserTribe } from './helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, TribeBox, Loader, EmptyState } from '../../components';

const limit = 5;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function ProfileTribe() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id, username } = route.params;

    const [array1, setArray1] = React.useState('_');

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextUserTribe(id, setArray1, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        getUserTribe(id, setArray1, setLastVisible, limit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text60>{username}</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const renderItem = React.useCallback(({item, index}) => (
        <TribeBox r 
        index={index} 
        route='TribeInfo' 
        {...item}/>
    ));

    const empty = React.useMemo(() => (
        <EmptyState
        icon='triangle' 
        type='feather' 
        title='No tribes'
        subtitle='You will see tribes joined here'/>
    ));

    const body = React.useMemo(() => (
        <FlatList
        data={array1}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.85}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==="_") return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            
            {array1.length===0?empty:body}
        </View>

    );

};