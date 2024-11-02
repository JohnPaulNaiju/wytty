import React from 'react';
import { TribeBox } from '../../components';
import { getNextTribes, getTribes } from './helper';
import { View, Colors, Text } from 'react-native-ui-lib';
import { ActivityIndicator, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const limit = 6;

let lastVisible = null;

const setLastVisible = (val) => {
    lastVisible = val;
};

const TribeSearch = ({searchTerm}) => {

    const [array1, setArray1] = React.useState('_');

    const [state, setState] = React.useState({
        loading: false,
        noresult: false,
    });

    const handleChange = React.useCallback((value) => {
        setState((state) => ({ ...state, ...value }));
    }, [setState]);

    const onEndReached = () => {
        if(array1.length>=limit){
            getNextTribes(setArray1, searchTerm, lastVisible, setLastVisible, limit);
        }
    };

    React.useEffect(() => {
        if(searchTerm?.trim().length!==0){
            handleChange({ loading: true, noresult: false });
            const delayDebounceFn = setTimeout(() => {
                const term = searchTerm?.toLowerCase();
                getTribes(setArray1, term, handleChange, setLastVisible, limit);
            }, 2000);
            return () => clearTimeout(delayDebounceFn);
        }else handleChange({ loading: false, noresult: false });
    }, [searchTerm]);

    const renderItem = React.useCallback(({item, index}) => (
        <TribeBox 
        r index={index} 
        route='TribeInfo' 
        {...item}/>
    ));

    return (

        <View flex bg-bg1 useSafeArea>
            <View width={width} center marginT-16>
                {state.loading?<ActivityIndicator color={Colors.textC2}/>:null}
                {state.noresult?<Text textC2 text80R>No tribes found</Text>:null}
            </View>
            <FlatList
            renderItem={renderItem}
            keyExtractor={(i,x) => x}
            onEndReachedThreshold={0.75}
            onEndReached={onEndReached}
            data={array1==='_'?[]:array1}
            showsVerticalScrollIndicator={false}/>
        </View>

    );

};

export default React.memo(TribeSearch);