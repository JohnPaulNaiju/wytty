import React from 'react';
import Icon from './Icon';
import { StyleSheet, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Colors } from 'react-native-ui-lib';

const Back = ({close, color}) => {

    const navigation = useNavigation();

    const click = React.useCallback(() => {
        if(Keyboard.isVisible()) Keyboard.dismiss();
        else{
            requestAnimationFrame(() => {
                if(navigation.canGoBack()) navigation.goBack();
                else navigation.navigate('HomeScreen');
            });
        }
    }, [navigation]);

    const styles = StyleSheet.create({
        radius: {
            borderTopRightRadius: 30, 
            borderBottomRightRadius: 30,
            borderTopLeftRadius: close?30:0,
            borderBottomLeftRadius: close?30:0,
            marginLeft: close?10:0,
            backgroundColor: color?color:Colors.bg2,
        }
    });

    return (

        <TouchableOpacity onPress={click}>
            <View width={60} height={45} center style={styles.radius}>
                <Icon name={close?"close":"arrow-back"}/>
            </View>
        </TouchableOpacity>

    );

};

export default React.memo(Back);