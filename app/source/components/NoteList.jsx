import React from 'react';
import Icon from './Icon';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const NoteList = ({title, subtitle, selected, firstElement, noTitle, onPress}) => {

    const ESelector = () => {
        switch(firstElement?.element){
            case 'text':
                return (
                    <View flex padding-16>
                        <Text 
                        style={{
                            fontSize: firstElement?.fontSize,
                            color: firstElement?.fontSize>18?Colors.textC1:Colors.textC2,
                            fontWeight: firstElement?.fontWeight,
                            fontStyle: firstElement?.fontStyle,
                            textDecorationLine: firstElement?.textDecorationLine,
                        }}>{firstElement?.text}</Text>
                    </View>
                );
            case 'code':
                return (
                    <View flex center>
                        <Icon name='microsoft-visual-studio-code' type='material-community' color={Colors.blue40} size={60}/>
                    </View>
                );
            default:
                return (
                    <View flex center>
                        <Icon name='edit-2' type='feather' color={Colors.primary} size={60}/>
                    </View>
                );
        }
    };

    return (

        <TouchableOpacity onPress={onPress}>
            <View width={width*0.5} height={width*0.6} center>
                <View width={width*0.45} height={width*0.45} br60 center bg-bg2
                style={{ borderWidth: selected?2:0, borderColor: selected?Colors.primary:null }}>
                    <View width={width*0.4} height={width*0.4} br60 bg-bg2 style={{ overflow: 'hidden' }}>
                        <ESelector/>
                        {subtitle?<Text textC2 text70R marginB-4 marginL-16>{subtitle}</Text>:null}
                    </View>
                </View>
                { noTitle?null:
                <View width={width*0.4} height={width*0.1} centerV>
                    <Text text60 textC1 style={{ fontWeight: 'bold' }} numberOfLines={1}>{title}</Text>
                </View>}
            </View>
        </TouchableOpacity>

    );

}

export default React.memo(NoteList);