import React from 'react';
import Icon from './Icon';
import { Video, ResizeMode } from 'expo-av';
import { View, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable } from 'react-native';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";

const BlurView = () => {

    const Blur = require('./Blur').default;

    return <Blur element='scontent'/>;

};

const RNVideo = ({url, width, vidHeight, scontent, top}) => {

    const navigation = useNavigation();

    const vidRef = React.useRef(null);
    const render = React.useRef(false);

    const [loading, setLoading] = React.useState(true);

    const inview = (e) => {
        if(e){
            if(!render.current){
                render.current = true;
                vidRef.current?.playAsync();
            }
        }else{
            vidRef.current?.pauseAsync();
            render.current = false;
        }
    };

    const onExpand = () => {
        vidRef.current?.presentFullscreenPlayer();
    };

    React.useEffect(() => {
        const unsub = navigation.addListener('blur', () => vidRef.current?.pauseAsync());
        return () => unsub();
    }, [navigation]);

    const overlay = React.useMemo(() => (
        <View right absV absH width='100%' height='100%'>
            <View margin-12 br60 padding-6 backgroundColor={Colors.bg1+'1f'}>
                { loading ?
                <ActivityIndicator size='small' color={Colors.textC1}/> : 
                <Icon name='video-camera' type='entypo' size={14}/> }
            </View>
        </View>
    ));

    const vidcomponent = React.useMemo(() => (
        <Video 
        isLooping 
        usePoster
        ref={vidRef} 
        source={{ uri: url }} 
        posterSource={{ uri: url }}
        resizeMode={ResizeMode.COVER} 
        onLoadStart={() => setLoading(true)} 
        onReadyForDisplay={() => setLoading(false)} 
        style={{ flex: 1, backgroundColor: Colors.black }} 
        onPlaybackStatusUpdate={e => setLoading(e.isBuffering)}/>
    ));

    return (

        <InViewPort onChange={inview}>
            <Pressable onPress={onExpand}>
                <View bg-bg1 marginTop={top || 0} width={width} height={vidHeight} borderRadius={15} overflow='hidden'>
                    {vidcomponent}
                    {scontent?<BlurView/>:overlay}
                </View>
            </Pressable>
        </InViewPort>

    );

};

export default React.memo(RNVideo);