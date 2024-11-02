import React from 'react';
import { Image } from 'expo-image';
import ViewShot from "react-native-view-shot";
import { Back, Icon } from '../../components';
import { saveToGallery } from '../../functions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { ActivityIndicator, Dimensions, Image as RNImage, Animated, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export default function ImageView() {

    const navigation = useNavigation();
    const route = useRoute();

    const { uri, scontent } = route.params;

    const scale = new Animated.Value(1);

    const imgRef = React.useRef(null);

    const [loading, setLoading] = React.useState(true);
    const [imgHeight, setImgHeight] = React.useState(0);

    const download = async() => {
        const uri = await imgRef.current?.capture();
        saveToGallery(uri);
    };

    const onPinchEvent = Animated.event(
        [
            {
                nativeEvent: { scale: scale }
            }
        ],
        {
            useNativeDriver: true
        }
    );

    const onPinchStateChange = event => {
        if(event.nativeEvent.oldState === State.ACTIVE){
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true
            }).start()
        }
    };

    React.useEffect(() => {
        RNImage.getSize(uri, (img_width, img_height) => {
            const ratio = width/img_width;
            const computedHeight = img_height*ratio;
            setImgHeight(computedHeight);
            setLoading(false);
        });
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                height: 0,
            },
            headerLeft: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View row centerV paddingH-16 spread width={width} height={50} marginTop={StatusBar.currentHeight}>
            <Back close/>
            <TouchableOpacity padding-6 marginR-16 onPress={() => {
                    if(!loading) download();
                }}>
                <Icon name='download' type='octicons'/>
            </TouchableOpacity>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            {header}
            <View flex center>
                {loading?
                <ActivityIndicator size='small' color={Colors.textC2}/>:
                <ViewShot ref={imgRef}>
                    <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
                        <Animated.Image
                        recyclingKey={uri}
                        contentFit='contain'
                        source={{ uri: uri }}
                        blurRadius={scontent?50:0}
                        placeholderContentFit='contain'
                        style={{ width: width, height: imgHeight, transform: [{ scale: scale }] }}
                        placeholder='https://wytty.org/placeholder.png'/>
                    </PinchGestureHandler>
                </ViewShot>}
            </View>
        </View>

    );

};