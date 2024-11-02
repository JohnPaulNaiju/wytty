import React from 'react';
import { Back } from '../../../components';
import { suspiciousUserReport } from './helper';
import { reportFunc } from '../../../functions';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';

export default function Report() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, userId, population } = route.params;

    const customNumReport = React.useMemo(() => Math.sqrt(population));
    const roundedValue = React.useMemo(() => Math.round(customNumReport));
    const customElapsedTime = population;

    const text = React.useMemo(() => `Atleast ${roundedValue} members must vote within ${customElapsedTime} minutes to remove a member.`);

    const onpress1 = () => {
        reportFunc(`/user/${userId}`);
    };

    const onpress2 = () => {
        reportFunc(`/user/${userId}`, 'bot_activity');
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'center',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => null,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    return (

        <View flex useSafeArea bg-bg1>
            
            <Text text40 textC1 marginL-16 marginT-16>Kickout User</Text>
            <Text text70R textC2 marginH-16 marginT-6 
            highlightStyle={{ color: Colors.textC1, fontWeight: 'bold' }}
            highlightString={text}>In Wყƚƚყ tribes, tribe members have more control than the tribe admins. Admins cannot remove a member by himself/herself. {text} Each member has 1 vote in each time period. This can help to decentralize power. This can also be used to remove rogue user or bots.</Text>
            <Text text70R textC2 marginH-16 marginT-4 >If a member is kicked out once, he/she cannot join the tribe again!</Text>
            <Button 
            marginH-26 marginT-26 enableShadow
            labelStyle={{ fontWeight: 'bold' }}
            onPress={() => suspiciousUserReport(roomId, userId, population)}
            bg-primary white text70 label='Vote to kickout'/>
            <Text textC2 text70R marginL-16 marginT-66>Looking for something else?</Text>
            <TouchableOpacity marginL-26 marginT-16 onPress={onpress1}>
                <Text textC2 text80R>• Report user</Text>
            </TouchableOpacity>
            <TouchableOpacity marginL-26 marginT-16 onPress={onpress2}>
                <Text textC2 text80R>• This user is a bot</Text>
            </TouchableOpacity>
        </View>

    );

};