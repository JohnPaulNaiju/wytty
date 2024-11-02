import React from 'react';
import { limits } from '../../hooks';
import { getFolders } from './helper';
import CreateFolder from './CreateFolder';
import { Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Colors, Text, TouchableOpacity } from 'react-native-ui-lib';
import { Back, EmptyState, FolderBox, Icon, Loader, Input } from '../../components';

const { width } = Dimensions.get('window');
const { folderLimit } = limits;

export default function Cloud() {

    const navigation = useNavigation();

    const [toggle, setToggle] = React.useState(true);
    const [search, setSearch] = React.useState('');
    const [folders, setFolders] = React.useState(['_']);

    const filteredItems = React.useMemo(() => {
        return folders.filter(folder => folder?.name?.trim()?.toLowerCase()?.includes(search));
    }, [folders, search]);

    const nav = (id, name, items, size) => {
        navigation.navigate('FolderScreen', {
            folderId: id,
            name: name,
            items: items,
            size: size,
            color: Colors.line
        });
    };

    const handleToggle = React.useCallback(() => {
        setToggle(state => !state);
    }, [setToggle]);

    React.useEffect(() => {
        getFolders(setFolders, folderLimit);
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerLeft: () => <Back/>,
            headerTitle: () => <Text text60 textC1>Cloυd</Text>,
            headerRight: () => (
                <TouchableOpacity marginR-16 padding-6 onPress={handleToggle}>
                    <Icon name='plus-circle' type='feather'/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const searchbar = React.useMemo(() => (
        <View width={width} height={60} center marginT-6>
            <Input 
            w={width*0.94} 
            val={search}
            placeholder='Search your folders...' 
            onChange={e => setSearch(e)}/>
        </View>
    ));

    const empty = React.useMemo(() => (
        <EmptyState 
        icon='folder' 
        type='feather' 
        title='No folders' 
        subtitle='Create new folder now'/>
    ));

    const folderView = React.useMemo(() => (
        <CreateFolder 
        len={folders.length} 
        open={!toggle} 
        close={handleToggle}/>
    ));

    const renderItem = React.useCallback(({item}) => (
        <FolderBox 
        onPress={() => nav(item.id, item.name, item.items, item.size)}
        {...item}/>
    ));

    const body = React.useMemo(() => (
        <FlatList
        style={{ flex: 1 }}
        data={filteredItems}
        renderItem={renderItem}
        ListHeaderComponent={searchbar}
        showsVerticalScrollIndicator={false}/>
    ));

    if(folders[0]==='_') return <Loader/>;

    return (

        <View flex bg-bg1 useSafeArea>
            {folderView}
            {folders.length===0?empty:body}
        </View>

    );

};