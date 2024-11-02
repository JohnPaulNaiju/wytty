import React from 'react';
import Section from './Section';
import { Icon } from '../../components';
import { category } from '../../functions';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Platform, Pressable } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Colors, TabController, Text } from 'react-native-ui-lib';

const isAndroid = Platform.OS==='android';
const { width } = Dimensions.get('window');

const screens = [{ label: 'All' }];

for(let i = 0; i < category.length; i++){
    screens.push({
        label: category[i].value,
    });
}

export default function Explore() {

    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            cardStyleInterpolator: isAndroid?CardStyleInterpolators.forBottomSheetAndroid:CardStyleInterpolators.forModalPresentationIOS,
            headerLeft: () => null,
            headerRight: () => null,
            headerTitle: () => (
                <Pressable onPress={() => navigation.navigate('Search')}>
                    <View center flex width={width} marginLeft={-16}>
                        <View bg-bg2 br30 row centerV paddingL-16 width={width*0.95} height={44}>
                            <Icon name='search' type='feather' color={Colors.textC2} size={18}/>
                            <Text textC2 text80R marginL-12>Search</Text>
                        </View>
                    </View>
                </Pressable>
            ),
        });
    }, [navigation]);

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
                    {screens.map((obj, i) => 
                    <TabController.TabPage key={i} index={i} lazy>
                        <Section category={obj.label}/>
                    </TabController.TabPage>)}
                </View>
            </TabController>
        </View>

    );

}