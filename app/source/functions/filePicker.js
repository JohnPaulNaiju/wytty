import Toast from 'react-native-toast-message';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';

const getPermission = async() => {
    try{
        const { granted } = await MediaLibrary.getPermissionsAsync();
        if(granted) return true;
        else{
            const { granted } = await MediaLibrary.requestPermissionsAsync();
            return granted;
        }
    }catch{}
};

export const pickFile = async(type) => {

    // Selection types
    // All: '*/*'
    // Image: 'image/*'
    // Video: 'video/*'

    try{
        const result = await DocumentPicker.getDocumentAsync({
            type: type,
            copyToCacheDirectory: false,
        });
        if(result.canceled) return false;
        const file = result.assets[0];
        const name = file?.name;
        const mime = file?.mimeType;
        const size = file?.size / (1024 * 1024);
        const uri = file?.uri;
        return { name, mime, size, uri };
    }catch{
        Toast.show({ text1: "Couldn't process your request" });
    }
};

export const getAlbums = async(setAlbums, handleTitle) => {
    try{
        const hasPermission = await getPermission();
        if(!hasPermission) return;
        const arr = [];
        const albums = await MediaLibrary.getAlbumsAsync({
            includeSmartAlbums: true,
        });
        arr.push({
            id: null,
            text: 'All',
            color: '#FFF',
            onPress: () => handleTitle(null, 'All'), //albums[0].title
        });
        for(let i = 0; i < albums.length; i++){
            arr.push({
                id: albums[i].id,
                text: albums[i].title,
                color: '#FFF',
                onPress: () => handleTitle(albums[i].id, albums[i].title),
            });
        }
        setAlbums(arr);
    }catch{}
};

export const getAssets = async(albumId, type, setAssets, setLastVisible) => {
    try{
        const hasPermission = await getPermission();
        if(!hasPermission) return;
        const assets = await MediaLibrary.getAssetsAsync({
            ...albumId&&{ album: albumId },
            mediaType: MediaLibrary.MediaType?.[`${type}`],
        });
        setLastVisible(assets.endCursor);
        setAssets(assets.assets.map(obj => ({ id: obj.id, uri: obj.uri })));
    }catch{}
};

export const getNextAssets = async(albumId, type, setAssets, after, setLastVisible) => {
    try{
        const assets = await MediaLibrary.getAssetsAsync({
            ...albumId&&{ album: albumId },
            ...after&&{ after: after },
            mediaType: MediaLibrary.MediaType?.[`${type}`],
        });
        setLastVisible(assets.endCursor);
        const newData = assets.assets.map(obj => ({ id: obj.id, uri: obj.uri }));
        setAssets(old => [...old, ...newData]);
    }catch{}
};