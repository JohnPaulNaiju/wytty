import React from 'react';
import Icon from './Icon';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

const Blur = ({element}) => {

    const [blurred, setBlurred] = React.useState(false);

    const scontent = React.useMemo(() => (
        <View flex center paddingH-26>
            <Icon size={28} name='visibility-off'/>
            <Text text80M white center>This media contains sensitive content which some people may find offensive or disturbing</Text>
        </View>
    ));

    const spoiler = React.useMemo(() => (
        <View flex center>
            <TouchableOpacity onPress={() => setBlurred(true)}>
                <View paddingH-12 paddingV-6 bg-primary br60>
                    <Text text70BO textC1 style={{ fontWeight: 'bold' }}>View spoiler</Text>
                </View>
            </TouchableOpacity>
        </View>
    ));

    const ESELECTOR = () => {
        switch(element){
            case 'spoiler':
                return spoiler;
            case 'scontent':
                return scontent;
            default:
                return null;
        };
    };

    if(blurred) return null;

    return (

        <View absV absH flex center backgroundColor={Colors.bg1+'F2'}>
            <ESELECTOR/>
        </View>

    );

}

export default React.memo(Blur);