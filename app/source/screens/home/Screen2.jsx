import React from 'react';
import { Image } from 'expo-image';
import { useData, limits } from '../../hooks';
import { Icon, Input } from '../../components';
import { formatNumber } from '../../functions';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { askToJoin, getTribe, joinTribe } from './helper';
import { ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { View, Text, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const { tLimit, uTLimit } = limits;

const Screen2 = ({tribeId, index}) => {

    const { profile } = useData();
    const navigation = useNavigation();

    const [roomId, setRoomId] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [member, setMember] = React.useState(true);

    const searchTribe = async(props) => {
        setLoading(true);
        setRoomId(props);
        const exists = await getTribe(props, setData, setMember);
        if(!exists) Toast.show({ text1: 'No tribe found' });
        setLoading(false);
    };

    const onPress = (RoomId, prop, isMember) => {
        if(isMember){
            navigation.navigate('Tribe', {...prop});
            return;
        }
        if(prop?.population>=tLimit){
            Toast.show({ text1: `A tribe can have only ${tLimit} members` });
            return;
        }else if(profile?.tribe>=uTLimit){
            Toast.show({ text1: 'You can only join 30 tribes' });
            return;
        }
        setMember(true);
        if(prop?.Public) joinTribe(RoomId, false, false, prop?.category);
        else askToJoin(RoomId);
    };

    React.useEffect(() => {
        if(index&&tribeId) searchTribe(tribeId);
    }, [index]);

    const searchview = React.useMemo(() => (
        <View width={width} centerH>
            <View row centerV>
                <Text textC1 text70M marginR-16>Searching for tribe... Please wait</Text>
                <ActivityIndicator size='small' color={Colors.textC2}/>
            </View>
            <Text textC2 text80R marginT-6>Tribe Id: {roomId}</Text>
        </View>
    ));

    const tribeview = React.useMemo(() => (
        <View width={width} centerH marginT-16>
            <View width={width*0.95} borderRadius={30} centerH bg-bg2 paddingB-16 paddingH-16>
                <Image source={{ uri: data?.bgImg }} recyclingKey={data?.bgImg} style={{ width: width*0.95, height: 200, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: Colors.bg2 }} placeholder='https://wytty.org/placeholder.png' placeholderContentFit='contain'/>
                <View marginTop={-50}>
                    <View bg-bg1 width={110} height={110} br100 center>
                        <Image 
                        recyclingKey={data?.dp} 
                        source={{ uri: data?.dp }} 
                        placeholderContentFit='contain' 
                        placeholder='https://shorturl.at/PQTW4' 
                        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.bg2 }}/>
                    </View>
                </View>
                <View row centerV paddingH-16 marginT-16>
                    <Text textC1 text60 numberOfLines={1} marginH-6>{data?.title}</Text>
                    { data?.verified ? <Icon name='verified' size={18}/> : null }
                </View>
                <Text textC2 text70R marginT-6 center>{data?.desc}</Text>
                <View row center marginT-16 width={width*0.95}>
                    <Icon name={data?.Public?"public":"lock"} color={Colors.textC2}/>
                    <Text textC2 text70R marginL-6 marginR-16>{data?.Public?'Public':'Private'}</Text>
                    <Icon name={data?.icon} color={Colors.textC2}/>
                    <Text textC2 text70R marginL-6 marginR-16>{data?.category}</Text>
                    <Icon name='groups' color={Colors.textC2}/>
                    <Text textC2 text70R marginL-6>{formatNumber(data?.population)}</Text>
                </View>
                <Button 
                disabled={loading}
                marginT-16 bg-primary white text70 label={member?'View':data?.Public?'Join':'Ask to join'}
                labelStyle={{ fontWeight: 'bold' }}
                style={{ width: width*0.8, heigth: 50 }}
                borderRadius={10} onPress={() => onPress(roomId, data, member)}/>
            </View>
        </View>
    ));

    const header = React.useMemo(() => (
        <View marginV-16 centerH width={width}>
            <Input 
            val={roomId}
            w={width*0.9}
            placeholder='Paste your tribe Id'
            onChange={e => setRoomId(e)}
            right={
                <TouchableOpacity padding-6 onPress={() => searchTribe(roomId)}>
                    <Icon name='search' type='feather' color={Colors.primary}/>
                </TouchableOpacity>
            }/>
        </View>
    ));

    return (

        <View flex centerH>
            {header}
            {loading?searchview:null}
            <FlatList
            style={{ flex: 1 }}
            keyExtractor={(i,x) => x}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={data!==null?tribeview:null}/>
        </View>

    );

};

export default React.memo(Screen2);