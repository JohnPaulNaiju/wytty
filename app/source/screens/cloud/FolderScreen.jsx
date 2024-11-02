import React from 'react';
import UploadBox from './UploadBox';
import { pickFile } from '../../functions';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { Dimensions, FlatList } from 'react-native';
import { useData, limits, useUpload } from '../../hooks';
import { FileList, Icon, Loader, Menu } from '../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';
import { checkCanUpload, deleteFolder, getFiles, deleteUserFile } from './helper';

const unsubscribe = [];
const { width } = Dimensions.get('window');
const { storage } = limits;

export default function FolderScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const { folderId, name, items, size } = route.params;

    const { profile } = useData();
    const { setFile, uploadToCloud } = useUpload();

    const [files, setFiles] = React.useState(['_']);

    const pick = async() => {
        const result = await pickFile('*/*');
        if(!result.uri) return;
        const gate = checkCanUpload(result.size, profile?.storageused, profile?.storage || storage);
        if(!gate) return;
        const file = {
            name: result.name,
            mime: result.mime,
            size: result.size,
            uri: result.uri,
        };
        setFile(state => ({
            ...state,
            ...file,
        }));
        uploadToCloud(file, folderId);
    };

    const initDelFolder = (len) => {
        if(len!==0){
            Toast.show({ text1: `Oops! This folder contains ${len} files` });
            return;
        }
        deleteFolder(folderId);
        navigation.goBack();
    };

    React.useEffect(() => {
        getFiles(folderId, setFiles, unsubscribe);
        return () => {
            for(let i = 0; i < unsubscribe.length; i++){
                unsubscribe[i]();
            }
        }
    }, [navigation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { 
                backgroundColor: Colors.bg2,
                height: 260,
            },
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerRight: () => (
                <View spread height='100%' paddingV-26>
                    <Menu 
                    style={{ marginRight: 22 }}
                    options={[
                        {
                            text: 'Delete folder',
                            icon: 'trash',
                            type: 'feather',
                            color: Colors.red,
                            onPress: () => {
                                setTimeout(() => {
                                    initDelFolder(files.length);
                                }, 100);
                            }
                        }
                    ]}
                    children={
                        <View padding-6>
                            <Icon name='more-horiz'/>
                        </View>
                    }/>
                    <TouchableOpacity padding-6 onPress={pick}>
                        <Icon name='plus-circle' type='feather'/>
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <View spread marginL-16>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-left' size={30}/>
                    </TouchableOpacity>
                    <View marginT-16>
                        <Icon name='folder' size={60}/>
                        <Text text60M white marginL-4>{name}</Text>
                        <Text text70R white marginL-4>{items||0} items  •  {Math.round(size||0)} MB</Text>
                    </View>
                </View>
            ),
            headerTitle: () => null,
        });
    }, [navigation, files.length]);

    const renderItem = React.useCallback(({item}) => (
        <FileList 
        share={false}
        open={() => {}}
        selected={false}
        onLongPress={() => {}}
        onDelete={() => deleteUserFile(folderId, item)}
        {...item}/>
    ));

    const itemSeperator = React.useMemo(() => <View width={width} height={0.7} bg-line/>);

    const empty = React.useMemo(() => (
        <View flex center>
            <Text textC2 text70R>No files here</Text>
        </View>
    ));

    const body = React.useMemo(() => (
        <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={itemSeperator}/>
    ));

    if(files[0]==='_') return <Loader/>;

    return (

        <View flex bg-bg2>
            <StatusBar animated translucent style="light" backgroundColor={Colors.bg2} networkActivityIndicatorVisible/>
            <View flex bg-bg1 useSafeArea style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <View marginT-26/>
                <UploadBox/>
                {files.length===0?empty:body}
            </View>
        </View>

    );

};