import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { View, Dialog, PanningProvider, Colors } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');

const ActionSheet = ({open, close, children}) => {

    const styles = StyleSheet.create({
        style: {
            width: width, 
            maxHeight: height*0.9, 
            borderTopLeftRadius: 15, 
            borderTopRightRadius: 15, 
            backgroundColor: Colors.bg1, 
            paddingVertical: 26,
        }
    });

    return (

        <Dialog bottom width={width} visible={open} onDismiss={close} overlayBackgroundColor={Colors.black+'6F'} panDirection={PanningProvider.Directions.DOWN}>
            <View centerH>
                <View width={60} height={5} br30 bg-grey40 marginB-8/>
                <View style={styles.style}>
                    {children}
                </View>
            </View>
        </Dialog>

    );

};

export default React.memo(ActionSheet);