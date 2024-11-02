import React from 'react';
import Icon from './Icon';
import Details from './Details';
import { Dimensions } from 'react-native';
import { openLink, stringToColor } from '../functions';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const FileBox = ({name, timestamp, by, filename, size, mime, url, category, msg, fullWidth}) => {

    const color = React.useMemo(() => stringToColor(category||'file'));

    return (

        <View br60 bg-bg2 padding-16 width={fullWidth?width*0.9:width*0.7} style={{ borderTopRightRadius: 18 }}>
            <TouchableOpacity onPress={() => openLink(url)}>
                <View row centerV>
                    <Icon name='file-text' type='feather' color={color} size={40}/>
                    <View marginL-6 paddingR-46>
                        <Text text70 textC1 numberOfLines={1} style={{ fontWeight: 'bold' }}>{filename}</Text>
                        <Text marginT-2 color={color} text80R numberOfLines={1}>{category}<Text text80R textC2> • {size} MB • {mime}</Text></Text>
                    </View>
                </View>
            </TouchableOpacity>
            {msg?.length>0?<Text textC1 text70R marginT-6>{msg}</Text>: null}
            <Details by={by} name={name} time={timestamp}/>
        </View>

    );

};

export default React.memo(FileBox);