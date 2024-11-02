import { auth, db } from "../../hooks";
import { getDp } from '../../functions';
import Toast from "react-native-toast-message";
import { doc, getDoc } from "firebase/firestore";
import { checkMemberShip } from "../home/helper";

export const getPost = async(id, setPost, setIsMember, setTribe, navigation) => {
    try{
        const docRef = doc(db, 'post', id);
        const post = await getDoc(docRef);
        const data = post.data();
        if(data.public){ 
            const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
            const liked = await getDoc(likeRef);
            const dp = await getDp(data.by);
            setIsMember(true);
            setPost({ 
                id: id,
                id: data.id, 
                by: data.by, 
                dp: dp, 
                name: data.name, 
                ...data.text&&{ text: data.text }, 
                timestamp: data.timestamp?.toDate(), 
                spoiler: data.spoiler, 
                likes: data.likes, 
                comments: data.comments, 
                scontent: data.scontent, 
                Public: data.public, 
                token: data.token, 
                verified: data.verified, 
                ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                ...data.imageUrl&&{ imageUrl: data.imageUrl }, 
                ...data.vidUrl&&{ vidUrl: data.vidUrl }, 
                liked: liked.exists(), 
            });
            const tribeRef = doc(db, 'tribe', data.tribeId);
            const tribeDoc = await getDoc(tribeRef);
            const tribeData = tribeDoc.data();
            setTribe({
                roomId: tribeDoc.id,
                title: tribeData.title,
                verified: tribeData.verified,
                desc: tribeData.desc,
                population: tribeData.population,
                bgImg: tribeData.bgImg,
                dp: tribeData.dp,
                category: tribeData.category,
                icon: tribeData.icon,
                Public: tribeData.public,
                people: tribeData.member?.slice(0,3),
            });
        }else{
            const isMember = await checkMemberShip(data.tribeId);
            setIsMember(isMember);
            if(isMember){
                const likeRef = doc(db, 'post', post.id, 'likedby', auth.currentUser.uid);
                const liked = await getDoc(likeRef);
                const dp = await getDp(data.by);
                setPost({ 
                    id: id,
                    id: data.id, 
                    by: data.by, 
                    dp: dp, 
                    name: data.name, 
                    ...data.text&&{ text: data.text }, 
                    timestamp: data.timestamp?.toDate(), 
                    spoiler: data.spoiler, 
                    likes: data.likes, 
                    comments: data.comments, 
                    scontent: data.scontent, 
                    Public: data.public, 
                    token: data.token, 
                    verified: data.verified, 
                    ...data.mediaHeight&&{ mediaHeight: data.mediaHeight }, 
                    ...data.imageUrl&&{ imageUrl: data.imageUrl }, 
                    ...data.vidUrl&&{ vidUrl: data.vidUrl }, 
                    liked: liked.exists(), 
                });
                const tribeRef = doc(db, 'tribe', data.tribeId);
                const tribeDoc = await getDoc(tribeRef);
                const tribeData = tribeDoc.data();
                setTribe({
                    roomId: tribeDoc.id,
                    title: tribeData.title,
                    verified: tribeData.verified,
                    desc: tribeData.desc,
                    population: tribeData.population,
                    bgImg: tribeData.bgImg,
                    dp: tribeData.dp,
                    category: tribeData.category,
                    icon: tribeData.icon,
                    Public: tribeData.public,
                    people: tribeData.member?.slice(0,3),
                });
            }else{
                Toast.show({ text1: 'You cannot view this private post' });
                navigation?.goBack();
            }
        }
    }catch{
        Toast.show({ text1: 'Oops! Something gone wrong!' });
    }
};