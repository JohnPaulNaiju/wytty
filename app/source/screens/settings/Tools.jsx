import React from 'react';
import Wave from './Wave';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const Tools = () => {

    const navigation = useNavigation();

    const notebox = React.useMemo(() => (
        <View width={width*0.5} center>
            <TouchableOpacity onPress={() => navigation.navigate('Note')}>
                <View br60 padding-16 spread width={width*0.45} bg-bg2>
                    <Text yellow30 text40 style={{ fontWeight: 'bold' }}>My{"\n"}Notes</Text>
                    <Text text90R textC2 marginT-16>Write Everything{"\n"}Avoid Oversharing</Text>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const cloudbox = React.useMemo(() => (
        <View height={width*0.5} width={width*0.5} centerH style={{ overflow: 'hidden' }}>
            <TouchableOpacity onPress={() => {
                requestAnimationFrame(() => {
                    navigation.navigate('Cloud');
                });
            }}>
                <View width={width*0.45} height={width*0.45} br60 bg-bg2 center>
                    <Wave size={width*0.45}/>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const postbox = React.useMemo(() => (
        <View width={width*0.5} center>
            <TouchableOpacity onPress={() => navigation.navigate('MyPost')}>
                <View width={width*0.45} br60 padding-16 spread bg-bg2>
                    <Text red text40 style={{ fontWeight: 'bold' }}>My{"\n"}Posts</Text>
                    <Text text90R textC2 marginT-6>Posts shared{"\n"}in tribes</Text>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const toolbox = React.useMemo(() => (
        <View width={width} row marginT-16>
            <View>
                {notebox}
                <View marginV-8/>
                {postbox}
            </View>
            {cloudbox}
        </View>
    ));

    return (

        <View marginV-16>
            <Text text70 textC1 marginL-16 style={{ fontWeight: 'bold' }}>Tools</Text>
            {toolbox}
        </View>

    );

};

export default React.memo(Tools);