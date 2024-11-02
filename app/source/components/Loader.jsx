import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Colors } from 'react-native-ui-lib';

const Loader = ({size, color}) => {

    if(size){
        return (
            <View center>
                <ActivityIndicator size='small' color={color?color:Colors.textC1}/>
            </View>
        );
    }

    return (

        <View flex useSafeArea center bg-bg1>
            <ActivityIndicator size='small' color={color?color:Colors.textC1}/>
        </View>

    );

};

export default React.memo(Loader);