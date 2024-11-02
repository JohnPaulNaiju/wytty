import React from 'react';
import Icon from './Icon';
import { Image } from 'expo-image';
import { formatNumber } from '../functions';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Colors } from 'react-native-ui-lib';

const TribeList = ({roomId, dp, verified, post, msg, mention, onPress, onLongPress}) => {

    const num = React.useMemo(() => (msg+post)||0);
    const msgnum = React.useMemo(() => formatNumber(num));

    const colorArr = React.useMemo(() => ['#1D1F216F', '#1D1F214F', '#1D1F218F', '#1D1F21DF', '#1D1F21FF']);

    const nav = () => {
        if(post>0){
            const { updateNum } = require('../screens/home/helper');
            updateNum(roomId, 'post', post);
        }
        onPress();
    };

    const badge = React.useMemo(() => (
        <View absT absR paddingH-6 row centerV bg-primary br60 height={16}>
            {mention>0?<Icon name='at-sign' type='feather' size={10}/>:null}
            {num>0?<Text textC1 text90 style={{ fontWeight: 'bold' }}>{msgnum}</Text>:null}
        </View>
    ));

    const style = StyleSheet.create({
        style: {
            width: 68,
            height: 68,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return (

        <Pressable onPress={nav} onLongPress={onLongPress}>
            <View center width={74} height={80}>
                <View>
                    <LinearGradient colors={colorArr} style={style.style}>
                        <View center flex>
                            <View bg-bg1 br100 center width={64} height={64}>
                                <Image 
                                recyclingKey={dp} 
                                source={{ uri: dp }} 
                                placeholderContentFit='contain' 
                                placeholder='https://wytty.org/placeholder.png'
                                style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.bg1 }}/>
                            </View>
                        </View>
                    </LinearGradient>
                    {verified?
                    <View absR absB>
                        <Icon name='verified' size={18}/>
                    </View>:null}
                    {(num>0||mention>0)?badge:null}
                </View>
            </View>
        </Pressable>

    );

};

export default React.memo(TribeList);