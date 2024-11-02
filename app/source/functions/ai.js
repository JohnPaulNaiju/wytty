import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

const API_KEY = Constants?.expoConfig?.extra?.OPENAI_API_KEY;

export const summarizeText = async(messages) => {
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    try{
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                messages: messages,
                model: 'gpt-3.5-turbo',
                max_tokens: 150, 
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }catch{
        Toast.show({ text1: 'Oops! something gone wrong' });
    }
};