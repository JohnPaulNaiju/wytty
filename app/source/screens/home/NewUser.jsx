import React from 'react';
import { newusergif } from '../../assets';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Image, Text, Button, Card } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');

const NewUser = () => {

    const navigation = useNavigation();

    const nav = () => {
        navigation.navigate('Explore');
    };

    return (

        <View flex center useSafeArea bg-bg1>
            <Card bg-bg2 borderRadius={20}>
                <View centerH br60 bg-bg2 width={width*0.8} height={height*0.5}>
                    <Image width={width*0.8} height={height*0.25} source={newusergif} style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}/>
                    <Text textC1 text50 center marginT-16 marginH-16>Join a tribe and grow {"\n"} with us 🥳</Text>
                    <Text textC2 text70R center marginH-16>Wytty is all about finding tribes and connecting, collaborating and interacting with like minded people.</Text>
                    <Button 
                    onPress={nav}
                    label='Explore tribes'
                    borderRadius={10} enableShadow
                    bg-primary white text70 marginT-12
                    labelStyle={{ fontWeight: 'bold' }}
                    style={{ width: width*0.65, height: 50 }}/>
                </View>
            </Card>
        </View>

    );

};

export default React.memo(NewUser);