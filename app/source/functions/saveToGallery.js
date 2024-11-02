import Toast from 'react-native-toast-message';
import * as MediaLibrary from 'expo-media-library';

const saveImage = async(uri) => {
    try{
        const asset = await MediaLibrary.createAssetAsync(uri);
        const albumExists = await MediaLibrary.getAlbumAsync('Wytty');
        if(albumExists===null){
            await MediaLibrary.createAlbumAsync('Wytty', asset, false);
        }else{
            await MediaLibrary.addAssetsToAlbumAsync(asset, albumExists, false);
        }
        Toast.show({ text1: 'Saved 🎉' });
    }catch{
        Toast.show({ text1: "Couldn't save" });
    }
}

export const saveToGallery = async(uri) => {
    try{
        const { granted } = await MediaLibrary.getPermissionsAsync();
        if(granted) saveImage(uri);
        else{
            const { granted } = await MediaLibrary.requestPermissionsAsync();
            if(granted) saveImage(uri);
        }
    }catch{}
}