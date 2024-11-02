import { linkRegex, rx } from './regex';
import { getLinkPreview } from "link-preview-js";

export const LinkPreview = async(msg) => {
    try{
        const url = linkRegex.test(msg);
        if(!url) return false;
        let title, image, uri;
        await getLinkPreview(msg).then((data) => {
            title = data.title || '';
            image = data.images[0] || 'https://shorturl.at/asvBD';
            uri = data.url || null;
            const youTube = uri.includes('youtube')||uri.includes('youtu.be');
            if(youTube){
                const arr = uri.match(rx);
                const videoId = arr[1];
                image = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` || 'https://shorturl.at/asvBD';
            }
        });
        return { title, image, uri };
    }catch{
        return false;
    }
};