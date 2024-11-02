import React from 'react';
import Icon from './Icon';
import { copyText, openLink } from '../functions';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const FileList = ({name, size, mime, url, open, onLongPress, onDelete, selected, share}) => {

    const onpress = () => {
        if(share) open();
        else openLink(url);
    };

    const longpress = () => {
        if(onLongPress) onLongPress();
        else copyText(url);
    };

    const deleteview = React.useMemo(() => (
        <TouchableOpacity onPress={onDelete}>
            <View width={width*0.2} height={60} center>
                <Icon name='trash-2' type='feather'/>
            </View>
        </TouchableOpacity>
    ));

    const openview = React.useMemo(() => (
        <TouchableOpacity onPress={open}>
            <View width={width*0.2} height={60} center>
                <Icon size={28} name='share' type='material-community'/>
            </View>
        </TouchableOpacity>
    ));

    return (

        <TouchableOpacity onPress={onpress} onLongPress={longpress}>
            <View width={width} height={60} spread row>
                <View height={60} width={width*0.8} row>
                    <View marginL-26 height={60} center>
                        <Icon size={30} 
                        name={selected?'checkmark-circle':'file-text'} 
                        type={selected?'ion':'feather'} 
                        color={selected?Colors.primary:null}/>
                    </View>
                    <View flex centerV paddingH-18>
                        <Text textC1 text70M numberOfLines={1}>{name}</Text>
                        <Text textC2 text80R>{mime} • {size} MB</Text>
                    </View>
                </View>
                {onDelete?deleteview:openview}
            </View>
        </TouchableOpacity>

    );

};

export default React.memo(FileList);