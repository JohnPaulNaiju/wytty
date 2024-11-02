import React from 'react';
import Icon from './Icon';
import { Image } from 'expo-image';
import { Dimensions, Pressable } from 'react-native';
import { View, Text, Colors} from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const UserSuggest = ({id, dp, username, name, verified, bio, token, onPress, onBtPress}) => {

    const [connected, setConnected] = React.useState(false);

    const onConnect = () => {
        setConnected(state => {
            onBtPress(id, username, token, state);
            return !state;
        });
    };

    return (

        <View width={width*0.5} height={270} center>
            <Pressable onPress={onPress}>
                <View width={width*0.45} height={250} bg-bg1 br40 style={{ borderWidth: 1, borderColor: Colors.bg2 }}>
                    <View width={width*0.45} marginT-16 center>
                        <View width={75} height={75} center>
                            <Image source={{ uri: dp }} recyclingKey={dp} placeholder='https://shorturl.at/PQTW4' placeholderContentFit='contain' style={{ width: 75, height: 75, borderRadius: 35, backgroundColor: Colors.bg2 }}/>
                            { verified ?
                            <View absB absR marginR-4 marginB-2>
                                <Icon name='verified' size={18}/>
                            </View> : null }
                        </View>
                    </View>
                    <View width={width*0.45} centerH marginT-8 paddingH-16>
                        <Text textC1 text70 numberOfLines={1} style={{ fontWeight: 'bold' }}>{username}</Text>
                        <Text textC2 text80R numberOfLines={1}>{name}</Text>
                        <Text textC2 text90R numberOfLines={1} center marginT-2>{bio}</Text>
                    </View>
                    <View width={width*0.45} flex center>
                        <Pressable onPress={onConnect}>
                            <View width={width*0.4} height={40} center br20 
                            backgroundColor={connected?null:Colors.primary}
                            style={{ borderWidth: connected?2:0, borderColor: connected?Colors.bg2:null }}>
                                <Text text70 style={{ fontWeight: 'bold' }}
                                color={connected?Colors.textC2:Colors.white}>{connected?'Requested':'Connect'}</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </View>

    );

};

export default React.memo(UserSuggest);