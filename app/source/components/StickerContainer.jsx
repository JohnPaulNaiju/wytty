import React from 'react';
import { Image } from 'expo-image';
import { giphyimg } from '../assets';
import { Dimensions, FlatList } from 'react-native';
import { View, TouchableOpacity, Text } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const StickerContainer = ({style, hide, stickers, send}) => {

    const onPress = (item) => {
        send(item?.images?.original?.url);
        setTimeout(() => { hide(); }, 100);
    };

    const renderItem = React.useCallback(({item}) => (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View center width={width*0.25} height={width*0.25}>
                <Image
                contentFit='contain'
                placeholderContentFit='contain'
                placeholder='https://wytty.org/placeholder.png'
                source={{ uri: item?.images?.original?.url }}
                recyclingKey={item?.images?.original?.url}
                style={{ width: width*0.15, height: width*0.15, borderRadius: 10 }}/>
            </View>
        </TouchableOpacity>
    ));

    const loading = React.useMemo(() => (
        <View center width={width} height='100%'>
            <View flex center>
                <Text textC2 text80R marginB-6>Loading stickers</Text>
            </View>
            <Image
            contentFit='contain'
            source={giphyimg}
            style={{ width: 100, height: '10%' }}/>
        </View>
    ));

    const stickerList = React.useMemo(() => (
        <FlatList
        numColumns={4}
        data={stickers}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        showsVerticalScrollIndicator={false}/>
    ));

    return (

        <View bg-bg1 reanimated style={style}>
            {(stickers?.length===0||stickers?.length===1)?loading:stickerList}
        </View>

    );

};

export default React.memo(StickerContainer);