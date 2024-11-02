import { format } from '@expo/timeago.js';

export const timeAgo = (timeObj) => {
    try{
        return format(timeObj, 'my-locale');
    }catch{}
}