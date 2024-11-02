import React from 'react';
import { auth } from '../../hooks';
import { ScrollView, Share } from 'react-native';
import { reportFunc, copyText } from '../../functions';
import { getNoteContent, summarizeNote } from './helper';
import { View, Text, Colors } from 'react-native-ui-lib';
import { RichEditor } from "react-native-pell-rich-editor";
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Back, Icon, Loader, Menu } from '../../components';

export default function NoteView() {

    const navigation = useNavigation();
    const route = useRoute();

    const { id } = route.params;

    const editor = React.useRef(null);

    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState({
        data: null,
        title: '',
        timestamp: null,
        editors: [],
        editorsData: [],
        by: null,
    });

    const handleOpen = React.useCallback(() => {
        setOpen(state => !state);
    }, [setOpen]);

    const navToProfile = (by) => {
        if(by===auth.currentUser.uid) return;
        navigation.navigate('OthersProfile', { id: by, username: null });
    };

    const alertOptions = React.useMemo(() => [
        {
            text: 'Report',
            color: Colors.red,
            onPress: () => reportFunc(`/note/${id}`)
        }
    ]);

    const share = (by) => {
        Share.share({
            title: 'Wყƚƚყ Notes',
            message: `Hey check this note on Wყƚƚყ!\nhttps://wytty.org/note/${id}/${by}\n`,
            url: `https://wytty.org/note/${id}/${by}`
        });
    };

    React.useEffect(() => {
        getNoteContent(id, setData);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text60 textC1 numberOfLines={1}>{data.title}</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                <Menu
                style={{ marginRight: 22 }}
                options={[
                    {
                        text: 'Summarize',
                        icon: 'dependabot',
                        type: 'octicons',
                        color: Colors.primary,
                        onPress: () => summarizeNote(data.data),
                    },
                    {
                        text: 'Copy link',
                        icon: 'link-2',
                        type: 'feather',
                        color: Colors.textC1,
                        onPress: () => copyText(`https://wytty.org/note/${id}`),
                    },
                    {
                        text: 'Share',
                        icon: 'share',
                        type: 'material-community',
                        color: Colors.textC1,
                        onPress: () => share(data.by),
                    },
                    {
                        text: 'Report',
                        icon: 'flag',
                        type: 'feather',
                        color: Colors.red,
                        onPress: () => handleOpen(),
                    }
                ]}
                children={
                    <View padding-6>
                        <Icon name='more-vert'/>
                    </View>
                }/>
            ),
        });
    }, [navigation, data.data, data.by, data.title]);

    const alert = React.useMemo(() => (
        <Alert 
        open={open} 
        close={handleOpen} 
        options={alertOptions} 
        showCancel title='Report' 
        subtitle='Report this note'/>
    ));

    if(data.data===null) return <Loader/>;

    return (

        <View flex useSafeArea bg-bg1>
            <ScrollView>
                <RichEditor 
                disabled 
                ref={editor} 
                scalesPageToFit 
                scrollEnabled={true} 
                initialContentHTML={data.data} 
                showsVerticalScrollIndicator={false} 
                editorStyle={{ backgroundColor: Colors.bg1, color: Colors.textC1 }}/>
            </ScrollView>
            {alert}
        </View>

    );

};