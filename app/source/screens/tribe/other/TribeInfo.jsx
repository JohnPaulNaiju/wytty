import React from 'react';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import Hyperlink from 'react-native-hyperlink';
import { limits, useData } from '../../../hooks';
import { Back, Icon, Alert, Menu } from '../../../components';
import { checkMemberShip, joinTribe } from '../../home/helper';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { View, Text, Colors, Button } from 'react-native-ui-lib';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Dimensions, FlatList, Platform, Share } from 'react-native';
import { reportFunc, formatNumber, stringToColor, openLink, copyText } from '../../../functions';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS==='android';
const { tLimit, uTLimit } = limits;

export default function TribeInfo() {

    const navigation = useNavigation();
    const route = useRoute();

    const { roomId, dp, title, desc, population, bgImg, category, icon, verified, Public } = route.params;

    const { profile } = useData();

    const [loading, setLoading] = React.useState(true);
    const [member, setMember] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const check = React.useCallback(async() => {
        const isMember = await checkMemberShip(roomId);
        setMember(isMember);
        setLoading(false);
    }, [setMember]);

    const join = () => {
        if(population>=tLimit){
            Toast.show({ text1: `A tribe can have only ${tLimit} members` });
            return;
        }else if(profile?.tribe>=uTLimit){
            Toast.show({ text1: `You can only join ${uTLimit} tribes` });
            return;
        }
        setMember((state) => !state);
        joinTribe(roomId, false, false, category).catch(() => {
            Toast.show({ text1: "Unable join tribe" });
            setMember((state) => !state);
        });
        Toast.show({ text1: `🎉 Welcome to ${title}` });
    };

    const invite = () => {
        Share.share({
            title: `${title} | Wყƚƚყ`,
            message: `Hey! Join ${title} tribe on Wყƚƚყ! A space to connect, share, chat and collaborate with people who share interest in ${category}. \nhttps://wytty.org/tribe/1/${roomId}\n`,
            url: `https://wytty.org/tribe/1/${roomId}`
        });
    };

    React.useEffect(() => {
        if(Public) check();
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            
            headerTitleAlign: 'center',
            cardStyleInterpolator: isAndroid?CardStyleInterpolators.forBottomSheetAndroid:CardStyleInterpolators.forModalPresentationIOS,
            headerTitle: () => null,
            headerLeft: () => <Back close/>,
            headerRight: () => (
                <Menu
                style={{ marginRight: 22 }}
                options={[
                    {
                        text: 'Share',
                        icon: 'share',
                        type: 'material-community',
                        onPress: () => invite()
                    },
                    {
                        text: 'Copy link',
                        icon: 'link-2',
                        type: 'feather',
                        onPress: () => copyText(`https://wytty.org/tribe/1/${roomId}`)
                    },
                    {
                        text: 'Report',
                        icon: 'flag',
                        type: 'feather',
                        color: Colors.red,
                        onPress: () => setOpen(state => !state)
                    }
                ]}
                children={
                    <View padding-6>
                        <Icon name='more-vert'/>
                    </View>
                }/>
            ),
        });
    }, [navigation]);

    const Header = React.useMemo(() => (
        <View width={width} centerH>
            <Image source={{ uri: bgImg }} recyclingKey={bgImg} style={{ width: width, height: 260, backgroundColor: Colors.bg2 }}/>
            <View width={width*0.9}>
                <View row centerV paddingR-106>
                    <View width={90} height={90} borderRadius={45} bg-bg1 center marginTop={-40}>
                        <Image 
                        recyclingKey={dp} 
                        source={{ uri: dp }} 
                        placeholderContentFit='contain' 
                        placeholder='https://shorturl.at/PQTW4' 
                        style={{ width: 80, height: 80, borderRadius: 40 }}/>
                    </View>
                    <Text textC1 text60 marginL-8 marginR-6 numberOfLines={1}>{title}</Text>
                    {verified?<Icon name='verified' size={18}/>:null}
                </View>
                <Hyperlink
                onPress={(url) => openLink(url)}
                onLongPress={(url) => copyText(url)}
                linkStyle={{ color: Colors.primary }}>
                    <Text textC2 text70R marginT-6>{desc}</Text>
                </Hyperlink>
            </View>
            <View row centerV width={width} marginT-16 paddingH-16>
                <View row centerV paddingH-12 paddingV-6 bg-line br60>
                    <Icon name={Public?"public":"lock"} color={Colors.textC2}/>
                    <Text textC2 text70R marginL-8>{Public?"Public":"Private"}</Text>
                </View>
                <View marginL-16 br60 row centerV marginT-2 paddingH-12 paddingV-6 backgroundColor={stringToColor(category)+'1A'}>
                    <Icon name={icon} size={16} color={stringToColor(category)}/>
                    <Text text80R marginL-4 color={stringToColor(category)}>{category}</Text>
                </View>
                <View row centerV marginL-16>
                    <Icon name='groups' color={Colors.textC2} />
                    <Text textC2 text70R marginL-12>{formatNumber(population||1)}</Text>
                </View>
            </View>
            {loading?
            <View center width={width} height={100}>
                <ActivityIndicator size='small' color={Colors.textC2}/>
            </View>:member?null: 
            <Button borderRadius={15} onPress={join}
            style={{ width: '90%', height: 50 }}
            disabled={member} text70 
            labelStyle={{ fontWeight: 'bold' }}
            bg-primary white marginT-26 marginB-40 
            label='Join'/>}
        </View>
    ));

    const alert = React.useMemo(() => (
        <Alert
        title='Report Tribe'
        subtitle='Report this tribe for not following community guidelines'
        close={() => setOpen(state => !state)}
        open={open}
        showCancel
        options={[
            {
                text: 'Report',
                color: Colors.red,
                onPress: () => reportFunc(`/tribe/${roomId}`)
            }
        ]}/>
    ));

    return (

        <View flex useSafeArea bg-bg1>
            <View marginT-16/>
            <FlatList
            keyExtractor={(i,x) => x}
            ListHeaderComponent={Header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={100}/>}/>
            {alert}
        </View>

    );

};