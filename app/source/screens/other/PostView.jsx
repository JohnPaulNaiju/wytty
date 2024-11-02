import React from 'react';
import { getPost } from './helper';
import { auth } from '../../hooks';
import { FlatList } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, Loader, PostBox, TribeBox } from '../../components';

export default function PostView() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id } = route.params;

    const [post, setPost] = React.useState(null);
    const [isMember, setIsMember] = React.useState(false);
    const [tribe, setTribe] = React.useState(null);

    const onDpPress = (userId, name) => {
        if(userId===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', { id: userId, username: name });
    };

    const fetchPost = async() => {
        await getPost(id, setPost, setIsMember, setTribe, navigation);
    };

    React.useEffect(() => {
        fetchPost();
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text50 textC1>Wყƚƚყ</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View flex>
            <PostBox 
            hide={!isMember}
            onDpPress={() => onDpPress(post?.by, post?.name)}
            {...post}/>
            {tribe?.roomId?
            <View flex>
                <Text textC1 text60 marginL-16 marginT-16>Post from</Text>
                <TribeBox {...tribe}/>
            </View>:null}
            <View height={100}/>
        </View>
    ));

    if(post===null) return <Loader/>;

    return (

        <View flex bg-bg1 useSafeArea>
            
            <FlatList
            ListHeaderComponent={header}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};