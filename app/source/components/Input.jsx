import React from 'react';
import Icon from './Icon';
import { Dimensions, ActivityIndicator } from 'react-native';
import { View, Colors, TouchableOpacity, TextField } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const Input = React.forwardRef((
    { 
        readonly = false,
        placeholder, 
        val, 
        onChange, 
        len, //max length
        valid, 
        notValid, 
        loading = false, 
        r, //border radius
        s, //search icon
        type, //keyboard return key type
        submit, 
        secure, //secure text entry
        w, //width
        h, //height
        multi, //multiline
        autoFocus, 
        right, //any right accessories
        ...rest 
    }, ref) => {

        const ViewWidth = React.useMemo(() => w?w:width*0.9);
        // const FieldWidth = React.useMemo(() => Math.round(ViewWidth*0.78));

        const [show, setShow] = React.useState(secure);

        const handleChange = React.useCallback(() => {
            setShow(state => !state);
        }, [setShow]);

        return (

            <View row paddingV-6 paddingH-20 spread centerV width={ViewWidth} maxHeight={multi?120:50} minHeight={h?h:50} borderRadius={r?r:15} bg-bg2 {...rest}>
                { s ? <Icon name='search' type='feather' color={Colors.textC2} style={{ marginRight: 16 }}/> : null }
                <TextField
                ref={ref}
                readonly={readonly}
                width='100%' 
                autoFocus={autoFocus}
                onChangeText={onChange}
                value={val}
                multiline={multi?true:false}
                placeholderTextColor={Colors.textC2}
                placeholder={placeholder}
                text70 textC2
                returnKeyType={type?type:null}
                onSubmitEditing={submit?submit:null}
                maxLength={len?len:30}
                secureTextEntry={show}
                autoCapitalize='none'/>
                <View spread row centerV maxWidth='20%'>
                    { loading ? <ActivityIndicator size='small' color={Colors.textC2}/> : 
                    <>
                    { valid ? <Icon name='check-circle' type='feather' size={16} color={Colors.primary}/> : null }
                    { notValid ? <Icon name='x-circle' type='feather' size={16} color={Colors.primary}/> : null }
                    </> }
                    { secure ?
                    <TouchableOpacity marginL-12 onPress={handleChange}>
                        <Icon name={!show?'visibility':'visibility-off'} color={Colors.icon}/>
                    </TouchableOpacity> : null }
                    { right ? right : null }
                </View>
            </View>

        );

});

export default React.memo(Input);