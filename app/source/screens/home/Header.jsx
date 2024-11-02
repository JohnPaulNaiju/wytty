import React from 'react';
import { searchMyTribes } from './helper';
import { View } from 'react-native-ui-lib';
import { Icon, Input } from '../../components';
import { Dimensions, Keyboard, Platform, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const limit = 5;
const isAndroid = Platform.OS==='android';

const Header = ({setTribes, close}) => {

    const [search, setSearch] = React.useState({
        text: '',
        loading: false,
    });

    const handleChange = React.useCallback((val) => {
        setSearch((state) => ({ ...state, ...val }));
    }, [setSearch]);

    React.useEffect(() => {
        const term = search.text.trim();
        if(term.length!==0){
            handleChange({ loading: true });
            const delayDebounceFn = setTimeout(() => {
                searchMyTribes(setTribes, term, handleChange, limit);
            }, 1000);
            return () => clearTimeout(delayDebounceFn);
        }else handleChange({ loading: false });
    }, [search.text]);

    React.useEffect(() => {
        Keyboard.addListener(isAndroid?'keyboardDidHide':'keyboardWillHide', close);
        return () => Keyboard.addListener(isAndroid?'keyboardDidHide':'keyboardWillHide', close).remove();
    }, []);

    return (

        <View row bg-bg1 centerV width={width}>
            <Pressable onPress={close}>
                <View flex center width={width*0.15}>
                    <Icon name='arrow-back' size={26}/>
                </View>
            </Pressable>
            <Input 
            bg-bg1 autoFocus 
            w={width*0.85} 
            val={search.text} 
            loading={search.loading}
            placeholder='Search your tribes...' 
            onChange={e => handleChange({ text: e })}/>
        </View>

    );

};

export default React.memo(Header);