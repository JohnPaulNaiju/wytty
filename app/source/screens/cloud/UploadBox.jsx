import React from 'react';
import { Icon } from '../../components';
import { useUpload } from '../../hooks';
import { Dimensions } from 'react-native';
import { View, Text, Colors, TouchableOpacity } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');

const UploadBox = () => {

    const { file, progress, abortTask } = useUpload();

    if(progress===0) return null;

    return (

        <View useSafeArea bg-bg1 centerH width={width} height={90}>
            <View row centerV paddingH-26 width={width} height={60}>
                <Icon name='file-text' type='feather' size={32} color={Colors.textC2}/>
                <View flex marginH-16>
                    <Text text80R textC2 numberOfLines={1}>{file?.name}</Text>
                    <Text text100R textC2 numberOfLines={1}>{Math.round(file?.size?.toFixed(2))} MB • {file?.mime} • {Math.round(progress)}%</Text>
                </View>
                <View height={60} width={70} center>
                    <TouchableOpacity onPress={abortTask}>
                        <Text text70 primary style={{ fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View br40 bg-bg2 width={width*0.88} height={10}>
                <View br40 bg-primary height='100%' width={Math.round(progress)+'%'}/>
            </View>
        </View>

    );

};

export default React.memo(UploadBox);