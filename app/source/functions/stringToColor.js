import { themes } from './themes';

export const stringToColor = (str) => {
    try{
        const string = str?.trim();
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % themes.length;
        return themes[index];
    }catch{
        return themes[0];
    }
};