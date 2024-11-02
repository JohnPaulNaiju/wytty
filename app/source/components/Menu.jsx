import React from 'react';
import Icon from './Icon';
import { Pressable } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const OptionsViewWithScroll = ({options}) => {

    const { ScrollView } = require('react-native');

    return (

        <ScrollView style={{ maxHeight: 500, borderRadius: 20, marginVertical: 16 }}>
            {options?.map((item, i) => {
                if(item){
                    return (
                        <MenuOption key={i} onSelect={item.onPress}>
                            <View row centerV paddingH-12 paddingV-8 style={{ borderBottomWidth: (i===options.length-1)?0:1, borderBottomColor: Colors.bg2 }}>
                                {item.icon?
                                <Icon 
                                type={item?.type} 
                                name={item?.icon} 
                                color={item?.color}/>:null}
                                <Text text70R marginL-12 color={item?.color||Colors.textC1}>{item.text}</Text>
                            </View>
                        </MenuOption>
                    );
                }
            })}
        </ScrollView>

    );

};

const RNMenu = React.forwardRef(({ children, options, triggerOnLongPress, scroll, ...rest }, ref) => {

    const optionsview = React.useMemo(() => (
        options?.map((item, i) => {
            if(item){
                return (
                    <MenuOption key={i} onSelect={item.onPress}>
                        <View row centerV paddingH-12 paddingV-8
                        style={{ borderBottomWidth: (i===options.length-1)?0:1, borderBottomColor: Colors.bg2 }}>
                            {item.icon?
                            <Icon 
                            type={item?.type} 
                            name={item?.icon} 
                            color={item?.color}/>:null}
                            <Text text70R marginL-12 color={item?.color||Colors.textC1}>{item.text}</Text>
                        </View>
                    </MenuOption>
                );
            }
        })
    ));

    return (

        <Menu ref={ref} {...rest}>
            <MenuTrigger 
            children={children} 
            triggerOnLongPress={triggerOnLongPress}
            customStyles={{ triggerTouchable: { activeOpacity: 1, underlayColor: Colors.bg1 }, TriggerTouchableComponent: Pressable }}/>
            <MenuOptions 
            customStyles={{ 
                optionsContainer: { 
                    backgroundColor: Colors.line, 
                    borderRadius: 20, 
                    marginHorizontal: 16, 
                } 
            }}>
                {options?scroll?<OptionsViewWithScroll options={options}/>:optionsview:null}
            </MenuOptions>
        </Menu>

    );

});

export default React.memo(RNMenu);