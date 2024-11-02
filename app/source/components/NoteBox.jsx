import React from 'react';
import Icon from './Icon';
import Details from './Details';
import { Dimensions } from 'react-native';
import { stringToColor } from '../functions';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const NoteBox = ({name, timestamp, by, noteId, title, category, msg, fullWidth}) => {

    const color = React.useMemo(() => stringToColor(category||title));

    const navigation = useNavigation();

    const nav = () => {
        navigation.navigate('NoteView', { id: noteId });
    };

    return (

        <View row centerV>
            <View br60 bg-bg2 width={fullWidth?width*0.9:width*0.7} padding-16>
                <TouchableOpacity onPress={nav}>
                    <View row centerV>
                        <Icon name='notebook' type='material-community' color={color} size={40}/>
                        <View marginL-6 paddingR-42>
                            <Text text70 textC1 numberOfLines={1} style={{ fontWeight: 'bold' }}>{title}</Text>
                            <Text color={color} text80 numberOfLines={1}>{category}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {msg?.length>0?<Text textC1 text70R marginT-6>{msg}</Text>: null}
                <Details by={by} name={name} time={timestamp}/>
            </View>
        </View>

    );

};

export default React.memo(NoteBox);