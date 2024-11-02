import React from 'react';
import { Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');

const PostEmpty = ({big}) => {

    return (

        <View center width={width} height={big?height:height*0.7}>
            <View>
                <View flex center absH absV>
                    <Image
                    contentFit='cover'
                    recyclingKey='https://shorturl.at/fQSTW'
                    source={{ uri: 'https://shorturl.at/fQSTW' }}
                    style={{ width: 180, height: 240, borderRadius: 15,  backgroundColor: Colors.bg2, transform: [{ rotate: '10deg' }, { translateX: 80 }, { translateY: -5 }] }}/>
                </View>
                <View flex center absH absV>
                    <Image
                    contentFit='cover'
                    recyclingKey='https://shorturl.at/dmsxN'
                    source={{ uri: 'https://shorturl.at/dmsxN' }}
                    style={{ width: 180, height: 240, borderRadius: 15,  backgroundColor: Colors.bg2, transform: [{ rotate: '-10deg' }, { translateX: -80 }, { translateY: -5 }] } }/>
                </View>
                <View flex center absH absV>
                    <Card style={{ width: 200, height: 260, borderRadius: 15, backgroundColor: Colors.bg2 }}>
                        <Image
                        contentFit='cover'
                        recyclingKey='https://shorturl.at/qrCF4'
                        source={{ uri: 'https://shorturl.at/qrCF4' }}
                        style={{ width: 200, height: 260, borderRadius: 15 }}/>
                    </Card>
                </View>
            </View>
            <Text textC1 text70 marginT-156 style={{ fontWeight: 'bold' }}>No Posts Yet</Text>
            <Text textC2 text80R>Share your posts in tribe!</Text>
        </View>

    );

};

export default React.memo(PostEmpty);