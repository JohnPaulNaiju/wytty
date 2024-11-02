import React from 'react';
import { Dimensions } from 'react-native';
import { copyText } from '../../functions';
import Toast from 'react-native-toast-message';
import { View, Text, Colors } from 'react-native-ui-lib';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Back, Icon, Menu, CodeView as RNCodeView } from '../../components';

const { width } = Dimensions.get('window');

export default function CodeView() {

    const navigation = useNavigation();
    const route = useRoute();

    const { code } = route.params;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => <Text text50 textC1>Code</Text>,
            headerLeft: () => <Back/>,
            headerRight: () => (
                <Menu
                style={{ marginRight: 22 }}
                options={[
                    {
                        text: 'Copy code',
                        icon: 'md-copy',
                        type: 'ion',
                        onPress: () => copyText(code)
                    },
                    {
                        text: 'Run',
                        icon: 'play',
                        type: 'font-awesome',
                        color: Colors.green,
                        onPress: () => Toast.show({ text1: 'Coming soon!' })
                    }
                ]}
                children={
                    <View padding-6>
                        <Icon name='microsoft-visual-studio-code' type='material-community' color={Colors.blue30} size={28}/>
                    </View>
                }/>
            ),
        });
    }, [navigation, code]);

    return (

        <View flex bg-bg1 useSafeArea centerH>
            
            <RNCodeView marginT-6 code={code} width={width*0.98}/>
        </View>

    );

};