import React from 'react';
import { limits } from '../../hooks';
import { createNewFolder } from './helper';
import Toast from 'react-native-toast-message';
import { Icon, Input, Loader } from '../../components';
import { Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { View, Text, Dialog, Colors, Button, PanningProvider, TouchableOpacity } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const { folderLimit } = limits;

const CreateFolder = ({len, open, close}) => {

    const titleRef = React.useRef('');
    const [loading, setLoading] = React.useState(false);

    const create = async() => {
        if(len>=folderLimit){
            Toast.show({ text1: `You can only create upto ${folderLimit} folder` });
            return;
        }
        if(titleRef.current?.trim().length===0) return;
        close();
        setLoading(state => !state);
        await createNewFolder(titleRef.current).catch(() => {
            Toast.show({ text1: "Coudln't create folder" });
        });
        setLoading(state => !state);
    };

    const footer = React.useMemo(() => (
        <View width={width*0.85} marginT-26 center>
            <Button 
            borderRadius={10}
            enableShadow onPress={create} 
            bg-primary white text70 label='Create'
            labelStyle={{ fontWeight: 'bold' }} 
            style={{ width: width*0.7 }}/>
        </View>
    ));

    const header = React.useMemo(() => (
        <View width={width*0.85} center>
            <Text textC1 text50>New Folder</Text>
            <Input 
            w={width*0.7}
            bg-bg2 autoFocus marginT-16 
            placeholder='Folder name' len={15} 
            onChange={e => titleRef.current = e}/>
        </View>
    ));

    const loader = React.useMemo(() => (
        <View width={width*0.85} centerH bottom height={60}>
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
                    <View bg-bg2 br40 centerH paddingV-26 width={width*0.85} style={{ borderWidth: 1, borderColor: Colors.bg2 }}>
                        {header}
                        {loading?loader:footer}
                        {closer}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Dialog>

    );

};

export default React.memo(CreateFolder);