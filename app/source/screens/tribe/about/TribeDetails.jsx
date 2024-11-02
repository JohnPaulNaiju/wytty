import React from 'react';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import Hyperlink from 'react-native-hyperlink';
import { deleteTribe, leaveTribe } from './helper';
import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon, ListItemWithIcon, Alert, Menu } from '../../../components';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';
import { ImageBackground, Dimensions, FlatList, Share } from 'react-native';
import { reportFunc, openLink, stringToColor, formatNumber, copyText } from '../../../functions';

const { width } = Dimensions.get('window');

export default function TribeDetails() {

    const navigation = useNavigation();
    const route = useRoute();

    const { title, bgImg, roomId, isMember, meAdmin, desc, population, verified, dp, Public, category, icon, owner } = route.params;

    const [index, setIndex] = React.useState(0);

    const colorArr = React.useMemo(() => ['#0F0F0F00', '#0F0F0F4F', '#0F0F0F8F', '#0F0F0FDF', '#0F0F0FFF']);

    const leaveOptions = React.useMemo(() => [
        {
            text: 'Leave',
            color: Colors.red,
            onPress: () => {
                if(owner){
                    Toast.show({ text1: 'Tribe creator cannot leave the tribe' });
                    return;
                }
                leaveTribe(roomId);
                navigation.goBack();
            }
        },
    ]);

    const reportOptions = React.useMemo(() => [
        {
            text: 'Report',
            color: Colors.red,
            onPress: () => reportFunc(`/tribe/${roomId}`)
        }
    ]);

    const delOptions = React.useMemo(() => [
        {
            text: 'Delete',
            color: Colors.red,
            onPress: () => {
                deleteTribe(roomId);
                navigation.goBack();
            }
        }
    ]);

    const open = (val) => {
        setTimeout(() => {
            setIndex(val);
        }, 100);
    }

    const close = () => {
        setTimeout(() => {
            setIndex(0);
        }, 100);
    };

    const navToMembers = () => {
        navigation.navigate('Members', { 
            roomId: roomId, 
            title: title,
            meAdmin: meAdmin,
            population: population,
            owner: owner
        });
    };

    const invite = () => {
        Share.share({
            title: `${title} | Wყƚƚყ`,
            message: `Hey! Join ${title} tribe on Wყƚƚყ! A space to connect, share, chat and collaborate with people who share interest in ${category}.\nhttps://wytty.org/tribe/1/${roomId}\n`,
            url: `https://wytty.org/tribe/1/${roomId}`
        });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { 
                backgroundColor: Colors.transparent,
                height: 0,
            },
            headerTitleAlign: 'left',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerTitle: () => null,
            headerLeft: () => null,
            headerRight: () => null,
        });
    }, [navigation]);

    const alerts = React.useMemo(() => (
        <React.Fragment>
            <Alert 
            title='Leave tribe' 
            subtitle='Are you sure you want to leave this tribe'
            open={index===1}
            close={close}
            showCancel
            options={leaveOptions}/>
            <Alert 
            title='Report tribe' 
            subtitle='Report this tribe for not following community guidelines'
            open={index===2}
            close={close}
            showCancel
            options={reportOptions}/>
            <Alert 
            title='Delete tribe' 
            subtitle='This action cannot be undone'
            open={index===3}
            close={close}
            showCancel
            options={delOptions}/>
        </React.Fragment>
    ));

    const menu = React.useMemo(() => (
        <Menu
        options={[
            {
                text: 'Copy tribe Id',
                icon: 'content-copy',
                onPress: () => copyText(roomId),
            },
            {
                text: 'Copy link',
                icon: 'link',
                type: 'ion',
                onPress: () => copyText(`https://wytty.org/tribe/1/${roomId}`),
            },
            {
                text: 'Share',
                icon: 'share',
                type: 'material-community',
                onPress: () => invite(),
            }
        ]}
        children={
            <View width={40} height={40} br60 backgroundColor='#0000006F' center>
                <Icon name='more-vert'/>
            </View>
        }/>
    ));

    const Header = React.useMemo(() => (
        <View width={width} centerH>
            <ImageBackground style={{ width: width, height: 260, backgroundColor: Colors.bg2 }} source={{ uri: bgImg }}>
                <LinearGradient colors={colorArr} style={{ flex: 1 }}>
                    <View flex bottom paddingB-16 paddingH-20>
                        <View row centerV spread>
                            <View row centerV maxWidth={width*0.75} paddingR-26>
                                <Image 
                                recyclingKey={dp} 
                                source={{ uri: dp }} 
                                placeholderContentFit='contain' 
                                placeholder='https://shorturl.at/PQTW4' 
                                style={{ width: 44, height: 44, borderRadius: 22 }}/>
                                <Text textC1 text60 marginH-8 numberOfLines={1}>{title}</Text>
                                { verified ? <Icon name='verified' size={20}/> : null }
                            </View>
                            {menu}
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>

            <View width={width} row centerV paddingH-12 marginT-6 spread>
                <View row centerV padding-4 br100 bg-bg2>
                    <View row centerV marginL-6>
                        <Icon name={Public?'public':'lock'} color={Colors.textC2}/>
                        <Text text70R textC2 marginL-6>{Public?'Public':'Private'}</Text>
                    </View>
                    <View row centerV marginL-16 paddingH-12 paddingV-6 br60 backgroundColor={stringToColor(category||'')+'1f'}>
                        <Text text70R color={stringToColor(category||'')} marginR-6>{category}</Text>
                        <Icon name={icon} color={stringToColor(category||'')}/>
                    </View>
                </View>
                <View/>
            </View>

            <View width={width*0.9} marginV-16>
                <Hyperlink
                onPress={(url) => openLink(url)}
                onLongPress={(url) => copyText(url)}
                linkStyle={{ color: Colors.primary }}>
                    <ReadMore numberOfLines={5}
                    renderTruncatedFooter={(handlePress) => (
                        <TouchableOpacity onPress={handlePress}>
                            <Text text70R primary>more...</Text>
                        </TouchableOpacity>
                    )}
                    renderRevealedFooter={(handlePress) => (
                        <TouchableOpacity onPress={handlePress}>
                            <Text text70R primary>less...</Text>
                        </TouchableOpacity>
                    )}>
                        <Text textC2 text70R>{desc}</Text>
                    </ReadMore>
                </Hyperlink>
            </View>

            <View bg-bg2 marginT-6 width={width} height={6}/>

            <ListItemWithIcon
            title='Tribe Members' 
            subtitle={`See ${formatNumber(population||0)} tribe members`}
            icon='users' 
            type='font-awesome' 
            color={Colors.textC2} 
            onPress={navToMembers}/>

            <ListItemWithIcon
            title='Search in tribe' 
            subtitle='Search messages shared in tribe'
            icon='search' 
            type='feather' 
            color={Colors.textC2} 
            onPress={() => navigation.navigate('SearchTribe', { 
                roomId: roomId, 
            })}/>

            <ListItemWithIcon
            title='Photos' 
            subtitle='See photos shared in tribe'
            icon='photograph' 
            type='fontisto' 
            color={Colors.textC2} 
            onPress={() => navigation.navigate('Media', { 
                roomId: roomId 
            })}/>

            <View bg-bg2 marginT-6 width={width} height={6}/>

            <ListItemWithIcon
            title='Leave tribe' 
            icon='logout' 
            color={Colors.red} 
            onPress={() => open(1)}/>
            <ListItemWithIcon
            title='Report tribe' 
            icon='report' 
            color={Colors.red} 
            onPress={() => open(2)}/>

            { (population===1&&isMember) ? 
            <ListItemWithIcon
            title='Delete tribe' 
            icon='delete' 
            color={Colors.red} 
            onPress={() => open(3)}/> : null }

        </View>
    ));

    return (

        <View flex bg-bg1>
            <FlatList
            ListHeaderComponent={Header}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View height={100}/>}/>
            {alerts}
            <View useSafeArea/>
        </View>

   );

};