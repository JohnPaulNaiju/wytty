import React from 'react';
import Icon from './Icon';
import { useNavigation } from '@react-navigation/native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { kimbieDark } from 'react-syntax-highlighter/src/styles/hljs';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const CodeView = ({width, code, language, onEditPress, ...rest}) => {

    const navigation = useNavigation();

    const navToCode = React.useCallback(() => {
        navigation.navigate('CodeView', { code: code });
    }, [code]);

    const highlighter = React.useMemo(() => (
        <SyntaxHighlighter 
        customStyle={{ backgroundColor: Colors.bg2 }}
        language={language?language:'javascript'} 
        style={kimbieDark} 
        highlighter={"hljs"}>
            {code}
        </SyntaxHighlighter>
    ));

    return (

        <View width={width} bg-bg2 br40 padding-16 {...rest}>
            <View row centerV spread>
                <View row centerV>
                    <Icon name='microsoft-visual-studio-code' type='material-community' color={Colors.blue40}/>
                    <Text textC1 text70BO marginL-6 style={{ fontWeight: 'bold' }}>Code</Text>
                </View>
                <View row centerV>
                    {onEditPress?
                    <TouchableOpacity marginR-22 onPress={onEditPress}>
                        <Icon 
                        size={18} 
                        name='edit'
                        type="feather" 
                        color={Colors.grey20}/>
                    </TouchableOpacity>:null}
                    <TouchableOpacity onPress={navToCode}>
                        <Icon 
                        size={18} 
                        type="entypo" 
                        color={Colors.grey20} 
                        name='resize-full-screen'/>
                    </TouchableOpacity>
                </View>
            </View>
            <View width='100%' height={0.17} bg-border marginT-16 marginB-6/>
            <View width='100%'>
                {highlighter}
            </View>
        </View>
    );

}

export default React.memo(CodeView);