import React from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { View, Text, Dialog, Colors, PanningProvider } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');

const Alert = ({open, close, title, subtitle, options, showCancel}) => {

    const titleview = React.useMemo(() => <Text center textC1 text60 marginT-18>{title}</Text>);

    const subtitleview = React.useMemo(() => <Text center textC2 text70R marginT-6>{subtitle}</Text>);

    const listview = React.useMemo(() => (
        <View>
            {options?.map((obj, i) => (
            <Pressable center key={i} onPress={() => {
                obj?.onPress();
                close();
            }}>
                <View centerH width={width}>
                    <View width={width} height={50} center>
                        <Text text70 color={obj.color?obj.color:Colors.textC2}>
                            {obj.text}
                        </Text>
                    </View>
                    <View width={width*0.7} height={0.7} bg-bg2/>
                </View>
            </Pressable>))}
        </View>
    ));

    const cancelview = React.useMemo(() => (
        <Pressable onPress={close}>
            <View width={width} height={60} center>
                <Text text70 textC1>Cancel</Text>
            </View>
        </Pressable>
    ));

    const styles = StyleSheet.create({
        style: {
            width: width, 
            maxHeight: height*0.5, 
            borderBottomLeftRadius: 15, 
            borderBottomRightRadius: 15, 
            backgroundColor: Colors.line, 
        }
    });

    return (

        <Dialog top width={width} height={height} visible={open} onDismiss={close} overlayBackgroundColor={Colors.black+'6F'} panDirection={PanningProvider.Directions.UP}>
            <View useSafeArea centerH style={styles.style}>
                {title?titleview:null}
                {subtitle?subtitleview:null}
                {listview}
                {showCancel?cancelview:null}
            </View>
        </Dialog>

    );

};

export default React.memo(Alert);