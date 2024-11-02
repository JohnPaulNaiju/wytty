import React from 'react';
import Icon from './Icon';
import { Image } from 'expo-image';
import AvatarGroup from './AvatarGroup';
import { stringToColor, getDp } from '../functions';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, ImageBackground, Pressable } from 'react-native';

const { width } = Dimensions.get('window');

const TribeBox = (props) => {

    const { title, desc, dp, verified, population, category, icon, people, bgImg, interested, small } = props;

    const navigation = useNavigation();

    const [urls, setUrls] = React.useState([]);

    const colorArr = React.useMemo(() => ['#1D1F2100', '#1D1F214F', '#1D1F218F', '#1D1F21DF', '#1D1F21FF']);
    const num = React.useMemo(() => population<4?0:population-3);
    const color = React.useMemo(() => stringToColor(category||'tribe'));

    const navigate = () => {
        navigation.navigate('TribeInfo', { ...props, urls: urls, onPress: null });
    };

    const getDps = async() => {
        if(small) return;
        const arr = [];
        for(let i = 0; i < people?.length; i++){
            const uri = await getDp(people[i]);
            arr.push(uri);
        }
        setUrls(arr);
    };

    React.useEffect(() => {
        getDps();
    }, []);

    const interest = React.useMemo(() => (
        <View bg-primary paddingH-8 paddingV-4 br60 absT absR marginTop={-8} marginR-6>
            <Text textC1 text90M>Based on your interest in {category}</Text>
        </View>
    ));

    const background = React.useMemo(() => (
        <ImageBackground style={{ width: width*0.95, height: 160 }} borderTopLeftRadius={20} borderTopRightRadius={20} source={{ uri: bgImg }}>
            <LinearGradient colors={colorArr} style={{ flex: 1 }}>
                <View height={160} width={width*0.95} bottom>
                    <View row centerV paddingL-16 paddingR-76>
                        <Image source={{ uri: dp }} recyclingKey={dp} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 40, height: 40, borderRadius: 20 }}/>
                        <Text textC1 text60 marginH-8 numberOfLines={1}>{title}</Text>
                        {verified?<Icon name='verified' size={16}/>:null}
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    ));

    const footer = React.useMemo(() => (
        <View width={width*0.95} paddingH-16>
            <View row centerV marginT-6>
                <View row centerV paddingH-6 paddingV-4 br60 backgroundColor={color+'2f'}>
                    <Icon size={14} name={icon} color={color}/>
                    <Text marginL-4 color={color} text80R>{category}</Text>
                </View>
                <View marginL-12>
                    <AvatarGroup size={20} limit={3} url={urls} num={num} color={Colors.bg1}/>
                </View>
            </View>
            <Text text70R textC2 numberOfLines={3}>{desc}</Text>
        </View>
    ));

    return (

        <Pressable onPress={navigate} marginT-16>
            <View marginT-16 width={width} centerH>
                <View width={width*0.95} br60 bg-bg2 paddingB-16>
                    {background}
                    {footer}
                </View>
                {interested?interest:null}
            </View>
        </Pressable>

    );

};

export default React.memo(TribeBox);