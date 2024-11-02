import React from 'react';
import { Image } from 'expo-image';
import { auth } from '../../hooks';
import AvatarGroup from '../AvatarGroup';
import { Video, ResizeMode } from 'expo-av';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Colors } from 'react-native-ui-lib';

const PostView = ({open, func, params, image, message, width}) => {

    const navigation = useNavigation();

    const navToPost = () => {
        if(func==='comment'){
            navigation.push('Comment', {
                by: auth.currentUser.uid , 
                id: params?.id, 
                show: false, 
            });
        }
    };

    const styles = StyleSheet.create({
        container: {
            borderWidth: 1, 
            borderColor: Colors.bg2,
            width: width*0.965,
            borderRadius: 10,
            backgroundColor: Colors.bg1,
            paddingVertical: 6,
            paddingHorizontal: 16
        },
        vid: {
            width: width*0.2,
            height: width*0.2,
            borderRadius: 10,
        }
    });

    const img = React.useMemo(() => (
        <Image 
        placeholderContentFit='contain' 
        recyclingKey={params?.imageUrl} 
        source={{ uri: params?.imageUrl }} 
        placeholder='https://wytty.org/placeholder.png' 
        style={{ width: width*0.2, height: width*0.2, borderRadius: 10 }}/>
    ));

    const vid = React.useMemo(() => (
        <Video 
        isMuted 
        isLooping 
        shouldPlay 
        style={styles.vid}
        resizeMode={ResizeMode.COVER}
        source={{ uri: params?.vidUrl }}/>
    ));

    const text = React.useMemo(() => <Text text80R textC2 marginB-6 numberOfLines={3}>❝{params.text}❞</Text>);

    return (

        <Pressable onPress={navToPost} onLongPress={open}>
            <View width={width}>
                <View style={styles.container}>
                    <View row>
                        <View paddingR-12 width={width*0.7}>
                            <AvatarGroup limit={4} size={40} url={image}/>
                            <Text text80R textC1 marginV-6 marginR-2>{message}</Text>
                        </View>
                        <View flex center>
                            <View bg-bg2 borderRadius={10}>
                                {params?.imageUrl?img:null}
                                {params?.vidUrl?vid:null}
                            </View>
                        </View>
                    </View>
                    {params?.text?text:null}
                </View>
            </View>
        </Pressable>

    );

};

export default React.memo(PostView);