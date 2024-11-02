import React from 'react';
import { createNotebook } from './helper';
import { Dimensions, Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Input, Loader, Icon } from '../../components';
import { View, Text, Dialog, Colors, Button, PanningProvider, TouchableOpacity } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

const CreateBox = ({open, close}) => {

    const titleRef = React.useRef('');
    const [loading, setLoading] = React.useState(false);

    const create = async() => {
        if(titleRef.current?.trim().length===0) return;
        setLoading(state => !state);
        await createNotebook(titleRef.current);
        setLoading(state => !state);
        close();
    };

    const header = React.useMemo(() => (
        <View width={width} center>
            <Text textC1 text50>New Note</Text>
            <Input 
            w={width*0.7}
            bg-bg2 autoFocus marginT-16 
            placeholder='Title' len={30} 
            onChange={e => titleRef.current = e}/>
        </View>
    ));

    const footer = React.useMemo(() => (
        <View width={width*0.8} marginT-26 center>
            <Button borderRadius={10} 
            onPress={create} enableShadow
            labelStyle={{ fontWeight: 'bold' }}
            style={{ width: width*0.7 }}
            bg-primary white text70 label='Create'/>
        </View>
    ));

    const loader = React.useMemo(() => (
        <View width={width} height={60} centerH bottom>
            <Loader size={50}/>
        </View>
    ));

    const closer = React.useMemo(() => (
        <View absT absR margin-16>
            <TouchableOpacity padding-12 onPress={close}>
                <Icon name='close' color={Colors.textC2}/>
            </TouchableOpacity>
        </View>
    ));

    return (

        <Dialog useSafeArea width={width} height={height} visible={open} onDismiss={close} panDirection={PanningProvider.Directions.UP} overlayBackgroundColor={Colors.black+'6F'}>
            <View width={width} height={height} center>
                <KeyboardAvoidingView behavior={isAndroid?null:'padding'} keyboardVerticalOffset={90}>
                    <View bg-bg2 br40 width={width*0.85} paddingV-26 centerH style={{ borderWidth: 1, borderColor: Colors.bg2 }}>
                        {header}
                        {loading?loader:footer}
                        {closer}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Dialog>

    );

};

export default React.memo(CreateBox);