import React from 'react';
import { Image } from 'expo-image';
import { formatNumber } from '../functions';
import { View, Text, Colors } from 'react-native-ui-lib';

const AvatarGroup = ({size, url, limit, num, color, ...rest}) => {

    const len = React.useMemo(() => url?.length);
    const more = React.useMemo(() => num?num:len>limit?len-limit:0);
    const bg = React.useMemo(() => color?color:Colors.bg1);

    const font = React.useMemo(() => ({
        text100R: size<21,
        text90R: size<26,
        text70R: size>=26,
        textC2: true,
    }));

    const items = React.useMemo(() => (
        url?.slice(0, limit)?.map((obj, i)=> (
            <Image
            key={i}
            recyclingKey={obj}
            source={{ uri: obj }}
            placeholderContentFit='contain'
            placeholder='https://shorturl.at/PQTW4'
            style={{ width: size, height: size, borderRadius: size, borderWidth: 1, borderColor: bg, marginLeft: i===0?0:-10 }}/>
        ))
    ));

    const moreview = React.useMemo(() => (
        <View center 
        backgroundColor={bg} paddingH-4
        minWidth={size<21?size:size+6} minHeight={size<21?size:size+6} 
        br100 marginLeft={-12}>
            <Text {...font}>+{formatNumber(more)}</Text>
        </View>
    ));

    return (

        <View row centerV height={size+20} {...rest}>
            {items}
            {more>0?moreview:null}
        </View>

    );

};

export default React.memo(AvatarGroup);