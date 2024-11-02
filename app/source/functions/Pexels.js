import Constants from 'expo-constants';

const apiKey = Constants?.expoConfig?.extra?.PEXEL_API_KEY;

export const Pexels = async(query, index, num) => {
    try{
        const url = `https://api.pexels.com/v1/search?query=${query?.trim()||"illustration"}&page=${index}&per_page=${num?num:16}`;
        const response = await fetch(url, {
            headers: { Authorization: apiKey }
        });
        const json = await response.json();
        return json.photos;
    }catch{}
};