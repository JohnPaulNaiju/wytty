import React from 'react';
import Send from './Send';
import Recieved from './Recieved';
import Messaging from './Messaging';
import { Input } from '../../components';
import { Dimensions } from 'react-native';
import { searchConversation } from './helper2';
import { useData, useNotify } from '../../hooks';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, TabController } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const limit = 5;

export default function Connection() {

    const navigation = useNavigation();

    const { notify, handleNotify } = useNotify();
    const { profile } = useData();

    const [users, setUsers] = React.useState([]);
    const [index, setIndex] = React.useState(0);

    const [search, setSearch] = React.useState({
        text: '',
        loading: false,
    });

    const update = (i) => {
        setIndex(i);
        if(i===1){
            if(notify.request){
                handleNotify({ request: false });
            }
        }
    };

    const handleChange = React.useCallback((val) => {
        setSearch(state => ({
            ...state,
            ...val,
        }));
    }, [setSearch]);

    const dot = React.useMemo(() => <View marginL-6 width={6} height={6} br60 bg-primary/>)

    const screens = React.useMemo(() => [
        { label: 'Message' }, 
        { label: 'Request', trailingAccessory: notify.request?dot:null }, 
        { label: 'Send' }, 
    ]);

    React.useEffect(() => {
        const term = search.text.trim().toLowerCase();
        if(term.length===0){
            handleChange({ loading: false });
        }else{
            handleChange({ loading: true });
            const delayDebounceFn = setTimeout(() => {
                searchConversation(term, profile?.connectionId, setUsers, limit, handleChange);
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [search.text]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text textC1 text50>Connections</Text>,
            headerLeft: () => null,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View width={width} height={60} center>
            <Input 
            w={width*0.94} 
            val={search.text}
            loading={search.loading}
            placeholder='Search your connections...' 
            onChange={e => handleChange({ text: e })}/>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            {index===0?header:null}
            <TabController items={screens} initialIndex={index} onChangeIndex={i => update(i)}>
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
                        <Messaging users={users} searchTerm={search.text.trim().toLowerCase()}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Recieved/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy>
                        <Send/>
                    </TabController.TabPage>
                </View>
            </TabController>
        </View>

    );

};