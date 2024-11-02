import React from 'react';
import Bot from './Bot';
import ImageView from './ImageView';
import Constants from 'expo-constants';
import { View } from 'react-native-ui-lib';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const DynamicIsland = ({props}) => {

    const styles = StyleSheet.create({
        container: {
            marginTop: Constants.statusBarHeight+6,
            minWidth: width*0.45,
            maxWidth: width*0.75,
            minHeight: 40,
        }
    });

    const ESelector = () => {
        switch(props?.type){
            case 'bot':
                return <Bot text={props?.text}/>;
            case 'image':
                return <ImageView width={width*0.45} uri={props?.uri}/>;
            default:
                return null;
        }
    };

    return (

        <View centerH width={width}>
            <View padding-8 br60 bg-black style={styles.container}>
                <ESelector/>
            </View>
        </View>

    );

};

export default React.memo(DynamicIsland);