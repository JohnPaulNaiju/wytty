import React from 'react';
import { getCategories } from './helper';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { EmptyState, Skeleton } from '../../../components';
import { Dimensions, ImageBackground } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const FileScreen = ({roomId, title, unsubscribe}) => {

    const navigation = useNavigation();

    const [array1, setArray1] = React.useState('_');

    const colorArr = React.useMemo(() => ['#1D1F2100', '#1D1F214F', '#1D1F218F', '#1D1F21DF', '#1D1F21FF']);

    const handleOpen = (cat) => {
        navigation.navigate('TribeFile', {
            roomId: roomId,
            cat: cat,
            title: title,
        });
    };

    React.useEffect(() => {
        getCategories(roomId, setArray1, unsubscribe);
    }, [roomId]);

    const empty = React.useMemo(() => (
        <EmptyState 
        fullHeight 
        type='feather' 
        icon='file-text' 
        title='No files' 
        subtitle='Start sharing notes and files now'/>
    ));

    const renderItem = React.useCallback(({item}) => (
        <View width={width*0.5} height={160} center>
            <TouchableOpacity onPress={() => handleOpen(item.text)}>
                <View br40 bg-bg2>
                    <ImageBackground style={{ width: width*0.45, height: 140 }} borderRadius={15} source={{ uri: item.bgImg }}>
                        <LinearGradient colors={colorArr} style={{ flex: 1, borderRadius: 12 }}>
                            <View flex padding-16 bottom>
                                <Text text60 white numberOfLines={1}>{item.text}</Text>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlashList
        data={array1}
        numColumns={2}
        estimatedItemSize={140}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        showsVerticalScrollIndicator={false}/>
    ));

    if(array1==='_') return <Skeleton type='file'/>;

    return (

        <View flex useSafeArea row>
            {array1.length===0?empty:body}
        </View>

    );

};

export default React.memo(FileScreen);