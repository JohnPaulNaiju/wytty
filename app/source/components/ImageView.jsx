import React from 'react';
import { Image } from 'expo-image';
import { Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Pressable, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const ImageView = ({uri, scontent, w, h, top, chat, post, disablePadding}) => {

    const navigation = useNavigation();

    const onpress = () => {
        navigation.navigate('ImageView', { uri: uri, scontent: scontent });
    };

    const styles = StyleSheet.create({
        img: {
            width: w || width*0.8, 
            height: h || width*0.8, 
            marginTop: top || 0, 
            borderWidth: chat?2:0, 
            borderRadius: disablePadding?0:15,
            borderColor: chat?Colors.bg2:null,
            backgroundColor: post?Colors.black:null,
        }
    });

    return (

        <Pressable onPress={onpress}>
            <Image
            style={styles.img}
            recyclingKey={uri}
            contentFit='cover'
            source={{ uri: uri }}
            blurRadius={scontent?50:0}
            placeholderContentFit='contain'
            placeholder='https://wytty.org/placeholder.png'/>
        </Pressable>

   );

};

export default React.memo(ImageView);

//     Image.getSize(uri, (img_width, img_height) => {
//         const ratio = w/img_width;
//         const computedHeight = img_height*ratio || width;
//     });