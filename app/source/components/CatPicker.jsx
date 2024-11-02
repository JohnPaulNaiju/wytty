import React from 'react';
import { category } from '../functions';
import { Dimensions } from 'react-native';
import { View, Picker, Colors } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const CatPicker = ({ placeholder, value, onChange, ...rest }) => {

    const change = React.useCallback((val) => {
        onChange({ category: val });
    }, [onChange]);

    const pickerview = React.useMemo(() => (
        <Picker useSafeArea textC2 text70 
        placeholderTextColor={Colors.textC2} placeholder={placeholder} 
        value={value} onChange={e => change(e)}>
            {category.map((item) => <Picker.Item key={item.code} value={item.value} label={item.value}/>)}
        </Picker>
    ));

    return (

        <View paddingH-20 paddingT-16 width={width*0.9} height={50} borderRadius={15} bg-bg2 {...rest}>
            {pickerview}
        </View>

    );

}

export default React.memo(CatPicker);