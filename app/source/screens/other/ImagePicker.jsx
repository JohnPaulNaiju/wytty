import React from 'react';
import { Image } from 'expo-image';
import { FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Dimensions, Platform, Pressable } from 'react-native';
import { Back, EmptyState, Icon, Menu } from '../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAlbums, getAssets, getNextAssets } from '../../functions';

const { width } = Dimensions.get('window');
let assestId = null;
const isAndroid = Platform.OS==='android';

export default function ImagePicker() {

    const navigation = useNavigation();
    const route = useRoute();

    const { from, type } = route.params;

    const [title, setTitle] = React.useState('All');
    const [assets, setAssets] = React.useState([]);
    const [albums, setAlbums] = React.useState([]);
    const [lastVisible, setLastVisible] = React.useState(null);

    const imgWidth = React.useMemo(() => width/3);

    const handelTitle = (id, val) => {
        setLastVisible(null);
        assestId = id;
        setTitle(val);
        getAssets(assestId, type, setAssets, setLastVisible);
    };

    const handleSelect = async(id) => {
        const asset = await MediaLibrary.getAssetInfoAsync(id);
        const fileURL = asset.localUri || asset.uri;
        const ratio = width*0.93/asset.width;
        const computedHeight = asset.height*ratio || width*0.93;
        navigation.navigate(from, { 
            ...route.params, 
            mediaHeight: computedHeight, 
            fileURL: fileURL, 
        });
    };

    const onEndReached = () => {
        getNextAssets(assestId, type, setAssets, lastVisible, setLastVisible);
    };

    React.useEffect(() => {
        getAssets(assestId, type, setAssets, setLastVisible);
        getAlbums(setAlbums, handelTitle);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: Colors.bg2 },
            headerTitleAlign: 'left',
            cardStyleInterpolator: isAndroid?CardStyleInterpolators.forBottomSheetAndroid:CardStyleInterpolators.forModalPresentationIOS,
            headerTitle: () => (
                albums.length===0?
                <View width={width*0.5}>
                    <Text textC1 text60 numberOfLines={1}>{title}</Text>
                </View>:
                <Menu
                scroll
                options={albums}
                children={
                    <View row centerV width={width*0.5}>
                        <Text textC1 text60 numberOfLines={1} marginR-2>{title}</Text>
                        <Icon name='arrow-drop-down'/>
                    </View>
                }/>
            ),
            headerLeft: () => <Back close/>,
            headerRight: () => null,
        });
    }, [navigation, title, albums]);

    const renderItem = React.useCallback(({item}) => (
        <Pressable onPress={() => handleSelect(item.id)}>
            <Image 
            recyclingKey={item.uri} 
            source={{ uri: item.uri }} 
            placeholderContentFit='contain' 
            placeholder='https://wytty.org/placeholder.png' 
            style={{ width: imgWidth, height: imgWidth, backgroundColor: Colors.bg1, borderWidth: 1, borderColor: Colors.line }}/>
        </Pressable>
    ));

    const body = React.useMemo(() => (
        <View flex>
            <FlatList
            data={assets}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.7}
            showsVerticalScrollIndicator={false}/>
        </View>
    ));

    const empty = React.useMemo(() => (
        <EmptyState
        icon='photograph'
        type='fontisto'
        bgColor={Colors.bg2}
        title={`No ${type}s available`}/>
    ));

    return (

        <View flex useSafeArea bg-bg2>
            {assets.length===0?empty:body}
        </View>

    );

};