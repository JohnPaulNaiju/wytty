import React from 'react';
import Icon from './Icon';
import Input from './Input';
import { Image } from 'expo-image';
import { Pexels } from '../functions';
import { Dimensions, FlatList } from 'react-native';
import { View, TouchableOpacity, Text } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const Pexel = ({handleChange, close}) => {

    const [searchRef, setSearchRef] = React.useState('');
    const [index, setIndex] = React.useState(1);
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const getPexels = async() => {
        setLoading((state) => !state);
        const urls = await Pexels(searchRef, index);
        setImages(urls);
        setLoading((state) =>!state);
    };

    const onClick = (uri) => {
        handleChange({ bgImg: uri });
        close();
    };

    const handleEndReached = () => {
        setIndex((state) => state + 1);
        getPexels();
    };

    React.useEffect(() => {
        getPexels();
    }, []);

    React.useEffect(() => {
        setIndex(1);
    }, [searchRef]);

    const renderItem = React.useCallback(({item}) => (
        <TouchableOpacity onPress={() => onClick(item.src.landscape)}>
            <View center height={90} width={width*0.25}>
                <Image
                placeholderContentFit='contain' 
                recyclingKey={item?.src?.landscape}
                source={{ uri: item?.src?.landscape }}
                placeholder='https://wytty.org/placeholder.png'
                style={{ width: width*0.2, height: 80, borderRadius: 10 }}/>
            </View>
        </TouchableOpacity>
    ));

    const Footer = React.useMemo(() => (
        <View width={width} center marginT-16>
            {images?.length>0?
            <TouchableOpacity onPress={handleEndReached}>
                <View row paddingH-16 width={width*0.4} height={36} bg-primary borderRadius={8} center>
                    <Icon name="dice-multiple" type="material-community"/>
                    <Text text70M white marginL-6>Shuffle</Text>
                </View>
            </TouchableOpacity> : null }
        </View>
    ));

    return (

        <View centerH width={width} height={500}>
            <Input 
            bg-bg2 
            marginB-26 
            w={width*0.95} 
            type="search" 
            val={searchRef} 
            loading={loading} 
            submit={getPexels} 
            onChange={ e => setSearchRef(e) } 
            placeholder="Search images with pexels"/>
            <FlatList
            data={images}
            numColumns={4}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            ListFooterComponent={Footer}/>
        </View>

    );

}

export default React.memo(Pexel);