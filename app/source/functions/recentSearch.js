import { getDp } from './getDp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const enqueueSearch = async(id, name) => {
    let userArr = [];
    try{
        const RecentSearchArray = await AsyncStorage.getItem('recent-search');
        if(RecentSearchArray!==null){
            userArr = [...JSON.parse(RecentSearchArray)];
            for(let i = 0; i < userArr.length; i++){
                if(userArr[i].id===id){
                    return;
                }
            }
            if(userArr.length>10) userArr.shift();
        }
        userArr.push({ id: id, name: name });
        await AsyncStorage.setItem('recent-search', JSON.stringify(userArr));
    }catch{}
}

const dequeueSearch = async(index, setRecents) => {
    let userArr = [];
    try{
        const RecentSearchArray = await AsyncStorage.getItem('recent-search');
        userArr = [...JSON.parse(RecentSearchArray)];
        userArr.splice(index, 1);
        setRecents(userArr);
        await AsyncStorage.setItem('recent-search', JSON.stringify(userArr));
    }catch{}
}

const getRecentSearch = async(setRecents) => {
    try{
        const RecentSearchArray = await AsyncStorage.getItem('recent-search');
        if(RecentSearchArray!==null){
            const userArr = [...JSON.parse(RecentSearchArray)];
            setRecents(await Promise.all(userArr.map(async(obj) => ({
                id: obj.id,
                username: obj.name,
                dp: await getDp(obj.id),
            }))));
        }else setRecents([]);
    }catch{}
}

export const recentSearch = {
    enqueueSearch: enqueueSearch,
    dequeueSearch: dequeueSearch,
    getRecentSearch: getRecentSearch,
};