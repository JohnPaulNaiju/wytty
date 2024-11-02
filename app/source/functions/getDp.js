import { getImageUrl } from "./getImageUrl";

const dpArr = {};

const flushDpCache = () => {
    const dpArrKeys = Object.keys(dpArr);
    if(dpArrKeys.length>100){
        const keysToRemove = dpArrKeys.slice(0, 10);
        keysToRemove.forEach((key) => {
            delete dpArr[key];
        });
    }
};

export const getDp = async(uid) => {
    try{
        if(uid in dpArr) return dpArr[uid];
        else{
            const dp = await getImageUrl(`users/${uid}/dp.webp`);
            dpArr[uid] = dp;
            flushDpCache();
            return dp;
        }
    }catch{
        return 'https://shorturl.at/PQTW4';
    }
};