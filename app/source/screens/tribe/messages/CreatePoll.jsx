import React from 'react';
import { createPoll } from '../poll/helper';
import Toast from 'react-native-toast-message';
import { Dimensions, FlatList } from 'react-native';
import { Back, Input, Icon } from '../../../components';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Colors, TouchableOpacity, Button } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

export default function CreatePoll() {

    const navigation = useNavigation();
    const route = useRoute();
    const { roomId } = route.params;

    const question = React.useRef('');

    const [options, setOptions] = React.useState([
        { text: '', vote: 0 }, 
        { text: '', vote: 0 }
    ]);

    const updateText = React.useCallback((e, i) => {
        setOptions((state) => {
            const updatedState = [...state];
            updatedState[i] = { ...updatedState[i], text: e };
            return updatedState;
        });
    }, [setOptions]);

    const addElement = React.useCallback(() => {
        setOptions(old => [...old, { text: '', vote: 0 }]);
    }, [setOptions]);

    const removeElement = (e) => {
        setOptions(options.filter((i, x) => x !== e));
    }

    const done = () => {
        navigation.goBack();
        createPoll(roomId, question.current, options).then(() => {
            Toast.show({ text1: 'Your poll was posted 🎉' });
        }).catch(() => {
            Toast.show({ text1: "Couldn't process your request" });
        });
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => (
                <View>
                    <Text text60 textC1>Create Poll</Text>
                    <Text textC2 text80R>Poll closes in 24 hour</Text>
                </View>
            ),
            headerLeft: () => <Back/>,
            headerRight: () => null,
        });
    }, [navigation]);

    const header = React.useMemo(() => (
        <View width={width} centerH>
            <View width={width*0.9} marginT-16>
                <Text text70 textC1 style={{ fontWeight: 'bold' }}>Question</Text>
                <Input
                len={60}
                multi
                marginT-6
                placeholder='Question'
                onChange={e => question.current=e}/>
            </View>
        </View>
    ));

    const footer = React.useMemo(() => (
        <View width={width} centerH>
            <View width={width*0.9} centerH>
                { (options.length<4 && options[options.length-1].text.length>0) ?
                <TouchableOpacity onPress={addElement}>
                    <View marginT-6 bg-bg2 width={width*0.9} height={45} borderRadius={30} center>
                        <Text textC2 text60>Add option</Text>
                    </View>
                </TouchableOpacity> : null }
                <Button bg-primary white text70 marginT-16
                style={{ width: width*0.9, height: 45 }}
                labelStyle={{ fontWeight: 'bold' }}
                disabled={(options[options.length-1].text.length<1)} onPress={done} label='Done'/>
            </View>
        </View>
    ));

    const renderItem = React.useCallback(({item, index}) => (
        <View width={width} centerH>
            { index===0 ?
            <View width={width*0.9} marginT-16>
                <Text text70 textC1 style={{ fontWeight: 'bold' }}>Options</Text>
            </View> : null }
            <View marginT-6 width={width*0.9} height={55} center key={index}>
                <Input
                val={item.text}
                onChange={ e => updateText(e, index)}
                placeholder={"Option "+(index+1)}
                maxLength={30}
                right={index>1 ? 
                <TouchableOpacity onPress={() => removeElement(index)}>
                    <Icon name="cancel" color={Colors.textC2}/>
                </TouchableOpacity> : null}/>
            </View>
        </View>
    ));

    return (

        <View flex useSafeArea bg-bg1 centerH>
            
            <FlatList
            data={options}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};