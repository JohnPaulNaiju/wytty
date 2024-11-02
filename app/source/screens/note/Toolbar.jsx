import React from 'react';
import { Icon, Input } from '../../components';
import Draggable from 'react-native-draggable';
import { Dimensions, FlatList } from 'react-native';
import { RichToolbar, actions } from "react-native-pell-rich-editor";
import { View, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { Heading, Align, Format, Lists, Media, Other } from './Render';
import { useSharedValue, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const options = [
    { icon: 'heading', type: 'octicons', content: Heading },
    { icon: 'text-format', type: 'material', content: Format },
    { icon: 'format-list-bulleted', type: 'material', content: Lists },
    { icon: 'format-quote', type: 'material', content: Other },
    { icon: 'align-center', type: 'feather', content: Align },
    { icon: 'perm-media', type: 'material', content: Media },
    { icon: 'gesture', type: 'material', content: Other },
];

const undo = () => <Icon name='undo-variant' type='material-community'/>;
const redo = () => <Icon name='redo-variant' type='material-community'/>;
const H1 = ({tintColor}) => <Icon name='format-header-1' type='material-community' color={tintColor}/>;
const H2 = ({tintColor}) => <Icon name='format-header-2' type='material-community' color={tintColor}/>;
const H3 = ({tintColor}) => <Icon name='format-header-3' type='material-community' color={tintColor}/>;
const H4 = ({tintColor}) => <Icon name='format-header-4' type='material-community' color={tintColor}/>;
const H5 = ({tintColor}) => <Icon name='format-header-5' type='material-community' color={tintColor}/>;
const H6 = ({tintColor}) => <Icon name='format-header-6' type='material-community' color={tintColor}/>;

const Toolbar = ({editor, addImage}) => {

    const height = useSharedValue(0);

    const inputRef = React.useRef(null);
    const textRef = React.useRef('');

    const [ix, setIX] = React.useState(-1);

    const style = useAnimatedStyle(() => ({ height: height.value }));

    const grow = (i1, i2) => {
        if(i1===i2){
            setIX(-1);
            height.value = withTiming(0, { duration: 300, easing: Easing.linear });
        }else{
            setIX(i1);
            height.value = withTiming(i1===5?100:50, { duration: 300, easing: Easing.linear });
        }
    };

    const renderOptions = React.useCallback(({item, index}) => (
        <TouchableOpacity onPress={() => grow(index, ix)}>
            <View center width={40} height={40}>
                <Icon name={item.icon} type={item.type} color={index===ix?Colors.yellow30:Colors.textC1}/>
            </View>
        </TouchableOpacity>
    ), [ix]);

    return (

        <View marginV-12 centerH width={width}>
            <View br60 bg-bg2 width={width*0.95}>
                <View reanimated centerV width={width*0.95} style={style} overflow='hidden'>
                    {ix===5?
                    <Input 
                    len={500} 
                    ref={inputRef} 
                    onChange={e => textRef.current=e}
                    placeholder='Paste your link here'/>
                    :null}
                    <RichToolbar 
                    iconSize={24} 
                    editor={editor} 
                    iconTint={Colors.textC1} 
                    onPressAddImage={() => { 
                        addImage(textRef.current); 
                        inputRef.current.clear(); 
                    }} 
                    selectedIconTint={Colors.yellow30} 
                    actions={ix===-1?[]:options[ix].content} 
                    style={{ backgroundColor: Colors.transparent, width: '100%', height: 40 }} 
                    iconMap={{ [actions.heading1]: H1, [actions.heading2]: H2, [actions.heading3]: H3, [actions.heading4]: H4, [actions.heading5]: H5, [actions.heading6]: H6 }}/>
                </View>
                <View row centerV width={width*0.95}>
                    <View centerV br60 bg-primary marginR-16 height={40}>
                        <RichToolbar
                        iconSize={24}
                        editor={editor}
                        iconTint={Colors.textC1}
                        selectedIconTint={Colors.yellow30}
                        actions={[actions.undo, actions.redo]}
                        iconMap={{ [actions.undo]: undo, [actions.redo]: redo }}
                        style={{ backgroundColor: Colors.transparent, width: '100%', height: 34 }}/>
                    </View>
                    <FlatList
                    horizontal
                    data={options}
                    keyExtractor={(i,x) => x}
                    renderItem={renderOptions}
                    showsHorizontalScrollIndicator={false}/>
                </View>
            </View>
        </View>

    );

};

export default React.memo(Toolbar);