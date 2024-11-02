import React from 'react';
import AvatarGroup from './AvatarGroup';
import { View, Text, Colors } from 'react-native-ui-lib';
import { stringToColor, formatNumber } from '../functions';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const PollBox = ({id, roomId, option, question, timestamp, totalVote, voted, votes, people, fullWidth}) => {

    const [urls, setUrls] = React.useState([]);

    const color = React.useMemo(() => stringToColor(question||'poll'));
    const num = React.useMemo(() => votes<4?0:votes-3);

    const Voted = React.useMemo(() => {
        if(voted) return true;
        const now = new Date();
        const Time = Date.parse(timestamp);
        if(now.getTime() - Time > 24 * 60 * 60 * 1000) return true;
        else return false;
    }, [timestamp, voted]);

    const vote = (i) => {
        if(!Voted){
            if(voted) return;
            const newArr = [...option];
            newArr[i].vote++;
            const { updatePollVote } = require('../screens/tribe/poll/helper');
            updatePollVote(roomId, id, newArr);
        }
    };

    const getDps = async() => {
        const { getDp } = require('../functions');
        setUrls(await Promise.all(people?.map(async(obj) => await getDp(obj))));
    };

    const textprop = React.useMemo(() => ({
        text90R: Voted,
        text70R: !Voted,
    }));

    React.useEffect(() => {
        getDps();
    }, [totalVote]);

    const styles = StyleSheet.create({
        line: {
            height: 10,
            backgroundColor: Voted?color:null,
            borderRadius: 60,
        },
        lineParent: {
            marginTop: 6,
            width: width*0.65,
            height: 10,
            borderRadius: 60,
            backgroundColor: Colors.line,
        }
    });

    const renderItem = React.useCallback(({item, index}) => (
        <Pressable onPress={() => vote(index)}>
            <View width={width*0.75} centerH marginT-16>
                <View width={width*0.65}>
                    <Text text70 textC1 marginL-6 style={{ fontWeight: 'bold' }} numberOfLines={1}>{item?.text?.trim()}</Text>
                    <View style={styles.lineParent}>
                        <View width={Voted?`${(item?.vote/totalVote||0)*100}%`:'100%'} style={styles.line}/>
                    </View>
                </View>
            </View>
        </Pressable>
    ));

    const qview = React.useMemo(() => question?<Text textC1 text70M center marginH-16 style={{ fontWeight: 'bold' }}>{question}</Text>:null);

    const optionview = React.useMemo(() => (
        <FlatList
        data={option}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={(i,x) => x}
        showsVerticalScrollIndicator={false}/>
    ));

    const footer = React.useMemo(() => (
        <View row centerV spread width={width*0.75} paddingH-16 marginT-16>
            <AvatarGroup size={20} limit={3} url={urls} num={num} color={Colors.bg2}/>
            <View>
                <Text textC2 {...textprop}>{formatNumber(totalVote)} votes</Text>
                {Voted?<Text text100L textC2>Poll closed</Text>:null}
            </View>
        </View>
    ));

    return (

        <View width={fullWidth?width:null} centerH marginT-16>
            <View width={width*0.75} bg-bg2 br60 paddingT-16 paddingB-6 center>
                {qview}
                {optionview}
                {footer}
            </View>
        </View>

    );

};

export default React.memo(PollBox);