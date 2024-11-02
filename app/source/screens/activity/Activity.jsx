import React from 'react';
import Header from './Header';
import { useData } from '../../hooks';
import { SectionList } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { ActivityBox, EmptyState, Icon, Loader } from '../../components';
import { deleteNotification, fetchNextNotifications, fetchNotifications } from './helper';

const limit = 20;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function Activity() {

    const navigation = useNavigation();
    const { profile } = useData();

    const scrollRef = React.useRef(null);

    useScrollToTop(scrollRef);

    const [array1, setArray1] = React.useState('_');

    const onEndReached = () => {
        if(array1.length>0){
            fetchNextNotifications(setArray1, lastVisible, setLastVisible, limit, profile?.lastChanged?.toDate());
        }
    };

    React.useEffect(() => {
        fetchNotifications(setArray1, setLastVisible, limit, profile?.lastChanged?.toDate());
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text50>Timeline</Text>,
            headerLeft: () => null,
            headerRight: () => null,
        });
    }, [navigation]);

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='category'
        title='' 
        subtitle='Nothing here'/>
    ));

    const renderItem = React.useCallback(({item}) => (
        <ActivityBox 
        onLongPress={() => () => deleteNotification(item.id)} 
        {...item}/>
    ));

    const header = React.useCallback(({section: { title }}) => (
        <View bg-bg1 row top width='100%' height={32} key={`id_${Math.random()}`}>
            <View centerH width={40} height='100%'>
                <Icon name='dot-circle-o' type='font' size={16} color={Colors.primary}/>
                <View width={2} height='100%' bg-primary/>
            </View>
            <Text textC1 text80 style={{ fontWeight: 'bold' }}>{title}</Text>
        </View>
    ));

    const body = React.useMemo(() => (
        <SectionList
        ref={scrollRef}
        sections={array1}
        renderItem={renderItem}
        keyExtractor={(i, x) => x}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.75}
        renderSectionHeader={header}
        ListHeaderComponent={<Header/>}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex bg-bg1 useSafeArea>
            {array1.length===0?empty:body}
        </View>

    );

};