import React from 'react';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import { Platform } from 'react-native';
import { Back } from '../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Colors, TabController } from 'react-native-ui-lib';
import { useNavigation, useRoute } from '@react-navigation/native';

const isAndroid = Platform.OS==='android';

export default function CreateTribe(){

    const navigation = useNavigation();
    const route = useRoute();

    const { index, tribeId } = route.params;

    const [ix, setIX] = React.useState(index);

    const screens = React.useMemo(() => [{label: 'Create tribe'}, {label: 'Join tribe'}]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'center',
            cardStyleInterpolator: isAndroid?CardStyleInterpolators.forBottomSheetAndroid:CardStyleInterpolators.forModalPresentationIOS,
            headerTitle: () => null,
            headerLeft: () => <Back close/>,
            headerRight: () => null,
        });
    }, [navigation]);

    return (

        <View flex bg-bg1 useSafeArea>
            <TabController 
            asCarousel 
            items={screens} 
            initialIndex={ix} 
            onChangeIndex={e => setIX(e)}>
                <TabController.TabBar 
                selectedLabelColor={Colors.textC1} 
                labelColor={Colors.textC2} 
                backgroundColor={Colors.bg1} 
                indicatorStyle={{ backgroundColor: Colors.textC1 }}/>
                <View flex>
                    <TabController.PageCarousel>
                        <TabController.TabPage index={0}>
                            <Screen1/>
                        </TabController.TabPage>
                        <TabController.TabPage index={1}>
                            <Screen2 tribeId={tribeId} index={ix}/>
                        </TabController.TabPage>
                    </TabController.PageCarousel>
                </View>
            </TabController>
        </View>

    );

};