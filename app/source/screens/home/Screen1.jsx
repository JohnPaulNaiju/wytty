import React from 'react';
import { CreateNewTribe } from './helper';
import { openLink } from '../../functions';
import { limits, useData } from '../../hooks';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ImageBackground, Dimensions, FlatList } from 'react-native';
import { View, Text, Colors, TouchableOpacity, Button, Switch } from 'react-native-ui-lib';
import { CatPicker, Icon, Input, Pexel, ActionSheet, ListItemWithIcon, Loader } from '../../components';

const { width } = Dimensions.get('window');
const { tLimit, uTLimit } = limits;

const Screen1 = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { profile } = useData();

    const [state, setState] = React.useState({
        create: false,
        open: false,
    });

    const [data, setData] = React.useState({
        title: '',
        desc: '',
        dp: '/',
        bgImg: '/',
        category: '',
        Public: true,
    });

    const [isValid, setIsValid] = React.useState({
        title: false,
        desc: false,
        bgImg: false,
        dp: false,
        category: false,
    });

    const handleChange = React.useCallback((value) => {
        setData((state) => ({ ...state, ...value }));
    }, [setData]);

    const handleState = React.useCallback((value) => {
        setState((state) => ({ ...state, ...value }));
    }, [setState]);

    const fetchDpFromGallery = async() => {
        navigation.navigate('ImagePicker', { from: 'CreateTribe', type: 'photo' });
    };

    const handleCreate = async(dataprops) => { 
        if(profile?.tribe>=uTLimit){
            Toast.show({ text1: `You can only join ${uTLimit} tribes` });
            return;
        }
        handleState({ create: true });
        await CreateNewTribe(dataprops).then((result) => {
            handleState({ create: false });
            if(!result) return;
            Toast.show({ text1: '🎉 Tribe created!' });
            navigation.goBack();
        }).catch(() => {
            handleState({ create: false });
            Toast.show({ text1: 'Cannot process your request' });
        });
    };

    React.useEffect(() => {
        const fileURL = route.params?.fileURL;
        if(fileURL) handleChange({ dp: fileURL });
    }, [route.params]);

    React.useEffect(() => {
        setIsValid((state) => ({
            ...state,
            title: data.title.trim().length>3,
            desc: data.desc.trim().length>5,
            bgImg: data.bgImg.length>5,
            dp: data.dp.length>5,
            category: data.category.length!==0,
        }));
    }, [setIsValid, data]);

    const children = React.useMemo(() => (
        <Pexel 
        handleChange={handleChange} 
        close={() => handleState({ open: false })}/>
    ));

    const action = React.useMemo(() => (
        <ActionSheet 
        open={state.open} 
        children={children} 
        close={() => handleState({ open: false })}/>
    ));

    const Header = React.useMemo(() => (
        <View flex centerH>

            <Input 
            len={50}
            marginT-16
            val={data.title}
            placeholder="Name"
            onChange={ e => handleChange({ title: e }) }/>

            <Input 
            len={500}
            paddingV-6
            marginT-16
            val={data.desc}
            placeholder="Description"
            multi
            onChange={ e => handleChange({ desc: e }) }/>

            <CatPicker marginT-16 placeholder='Category' value={data.category} onChange={handleChange}/>

            <View width={width} row marginT-16>
                <View width={width*0.5} center>
                    <TouchableOpacity onPress={fetchDpFromGallery}>
                        <ImageBackground borderRadius={20} source={{ uri: data.dp }}>
                            <View paddingH-16 width={width*0.4} height={160} center borderRadius={20} style={{ borderWidth: 5, borderColor: Colors.bg2 }}>
                                <Icon name='image'/>
                                <Text text70 textC1 center marginT-6>Display Picture</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <View width={width*0.5} center>
                    <TouchableOpacity onPress={() => setState((data) => ({ ...data, open: !data.open }))}>
                        <ImageBackground borderRadius={20} source={{ uri: data.bgImg }}>
                            <View paddingH-16 width={width*0.4} height={160} center borderRadius={20} style={{ borderWidth: 5, borderColor: Colors.bg2 }}>
                                <Icon name='image'/>
                                <Text text70 textC1 center marginT-6>Background</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>

            <ListItemWithIcon
            marginT-16
            icon='lock'
            title='Private tribe'
            subtitle='Only users with tribe Id can join'
            right={<Switch value={!data.Public} onValueChange={e => handleChange({ Public: !e })} onColor={Colors.primary}/>}/>

            <Text text70R textC1 marginT-26 marginH-8 center>By creating tribe, this tribe agree's to follow our</Text>
            <TouchableOpacity onPress={() => openLink('wytty.org/#/community-guidelines')}>
                <Text primary text70R> community guidlines</Text>
            </TouchableOpacity>

            <Text text80R textC2 marginT-26>Tribe details can't be edited once its created</Text>
            <Text text80R textC2>Tribe max capacity is {tLimit} members</Text>
            <Text text80R textC2>You can only create/join {uTLimit} tribes</Text>

            { state.create ? 
            <View marginT-26 center width={width*0.9} height={50}>
                <Loader size={50} top={12}/>
            </View>
            : 
            <Button 
            disabled={Object.values(isValid).includes(false)} 
            onPress={() => handleCreate(data)} borderRadius={15}
            style={{ width: '90%', height: 50 }}
            labelStyle={{ fontWeight: 'bold' }}
            bg-primary white marginT-26 text70
            label='Create new tribe'/> }

            {state.open?action:null}

        </View>
    ));

    return <FlatList ListHeaderComponent={Header} showsVerticalScrollIndicator={false} ListFooterComponent={<View height={100}/>}/>;

};

export default React.memo(Screen1);