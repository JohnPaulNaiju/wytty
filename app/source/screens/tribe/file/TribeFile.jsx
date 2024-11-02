import React from 'react';
import { auth } from '../../../hooks';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { reportFunc } from '../../../functions';
import { DeleteMessage } from '../messages/helper';
import { View, Text, Colors } from 'react-native-ui-lib';
import { getNextTribeFiles, getTribeFiles } from './helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, Icon, Loader, Menu, TMessage } from '../../../components';

const { width } = Dimensions.get('window');
const limit = 20;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

export default function TribeFile() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, cat, title } = route.params;

    const [array1, setArray1] = React.useState('_');

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextTribeFiles(roomId, setArray1, lastVisible, setLastVisible, limit, cat);
        }
    };

    React.useEffect(() => {
        getTribeFiles(roomId, setArray1, lastVisible, setLastVisible, limit, cat);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View>
                    <Text text60 textC1>{cat}</Text>
                    <Text text70R textC2>{title}</Text>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

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
                    if(item.by===auth.currentUser.uid) DeleteMessage(roomId, item.id, null);
                    else reportFunc(`/tribe/${roomId}/message/${item.id}`);
                }
            }
        ]}
        children={
            <View width={width} centerH marginT-6>
                <TMessage
                w={width*0.9}
                fullWidth
                noAlign
                noDetails
                {...item}/>
            </View>
        }/>
    ));

    const empty = React.useMemo(() => (
        <View flex center>
            <Icon name='bee-flower' type='material-community' color={Colors.textC2} size={30}/>
            <Text text70R textC2 marginT-6>No files or notes</Text>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1} 
        estimatedItemSize={118}
        renderItem={renderItem} 
        keyExtractor={(i,x) => x} 
        onEndReached={onEndReached} 
        onEndReachedThreshold={0.9} 
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            {array1.length===0?empty:body}
        </View>

    );

};