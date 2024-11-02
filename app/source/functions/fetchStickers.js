import Constants from 'expo-constants';
import Toast from "react-native-toast-message";

const apiKey = Constants?.expoConfig?.extra?.GIPHY_API_KEY;

export const fetchStickers = async(e) => {
    try{
        const BASE_URL = `https://api.giphy.com/v1/stickers/${e?.trim()?.length>0?'search':'trending'}`;
        const resJson = await fetch(`${BASE_URL}?api_key=${apiKey}&q=${e}&limit=32`);
        const res = await resJson.json();
        return res.data;
    }catch{
        Toast.show({ text1: "Couldn't fetch stickers" });
    }
};