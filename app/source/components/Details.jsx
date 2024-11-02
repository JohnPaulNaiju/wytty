import React from 'react';
import { auth } from '../hooks';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { stringToColor, timeAgo, getDp } from '../functions';

const BotView = () => {

    const Icon = require('./Icon').default;

    return (

        <View padding-6 br60 bg-primary>
            <Icon name='dependabot' type='octicons' size={20}/>
        </View>

    );

};

const Details = ({ name, time, by, ...rest}) => {

    const navigation = useNavigation();

    const [dp, setDp] = React.useState('https://shorturl.at/PQTW4');

    const color = React.useMemo(() => stringToColor(name));
    const bgcolor = React.useMemo(() => color+"1a");
    const timestamp = React.useMemo(() => timeAgo(time));

    const fetchDp = async() => {
        const uri = await getDp(by);
        setDp(uri);
    };

    const onClick = () => {
        if(by===auth.currentUser.uid||by==='@cleo') return;
        navigation.navigate('OthersProfile', { id: by, username: name });
    };

    React.useEffect(() => {
        if(by!=='@cleo') fetchDp();
    }, [by]);

    return (

        <View row centerV marginT-16 marginL-8 {...rest}>
            <Pressable onPress={onClick}>
                <View row centerV>
                    {by==='@cleo'?<BotView/>:
                    <Image 
                    recyclingKey={dp} 
                    source={{ uri: dp }} 
                    placeholderContentFit='contain' 
                    placeholder='https://shorturl.at/PQTW4' 
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.bg2 }}/>}
                    <View paddingV-2 paddingH-6 marginL-12 br30 backgroundColor={bgcolor}>
                        <Text color={color} text80M>{name}</Text>
                    </View>
                </View>
            </Pressable>
            <Text textC2 text80R marginL-4>• {timestamp}</Text>
        </View>

    );

};

export default React.memo(Details);