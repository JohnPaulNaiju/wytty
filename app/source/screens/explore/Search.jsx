import React from 'react';
import UserSearch from './UserSearch';
import TribeSearch from './TribeSearch';
import { Back } from '../../components';
import { Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, Colors, TabController, TextField } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';

export default function Search() {

    const navigation = useNavigation();

    const screens = React.useMemo(() => [
        { label: 'Tribes' }, 
        { label: 'Account' }, 
    ]);

    const [searchTerm, setSearchTerm] = React.useState('');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerLeft: () => <Back color={Colors.transparent}/>,
            headerRight: () => null,
            headerTitle: () => (
                <View centerV paddingH-16 bg-bg2 br30 height={44} width={width*0.8} marginLeft={isAndroid?26:-16}>
                    <TextField
                    autoFocus
                    value={searchTerm}
                    placeholder='Search'
                    style={{ width: '100%' }}
                    placeholderTextColor={Colors.textC2}
                    onChangeText={e => setSearchTerm(e)}/>
                </View>
            ),
        });
    }, [navigation, searchTerm]);

    return (

        <View flex useSafeArea bg-bg1>
            <TabController items={screens}>
                <TabController.TabBar 
                labelColor={Colors.textC2} 
                backgroundColor={Colors.bg1} 
                selectedLabelColor={Colors.textC1} 
                indicatorStyle={{ backgroundColor: Colors.textC1 }}
                containerStyle={{ 
                    borderBottomWidth: 1, 
                    borderBottomColor: Colors.line, 
                }}/>
                <View flex>
                    <TabController.TabPage index={0} lazy>
                        <TribeSearch searchTerm={searchTerm}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <UserSearch searchTerm={searchTerm}/>
                    </TabController.TabPage>
                </View>
            </TabController>
        </View>

    );

};