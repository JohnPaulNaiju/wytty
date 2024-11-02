import stopwords from './en.json';

export const removeStopWords = (text) => {
    try{
        const words = text?.toLowerCase()?.split(' ');
        const filteredWords = words?.filter((word) => !stopwords?.includes(word?.toLowerCase()));
        return filteredWords;
    }catch{}
}