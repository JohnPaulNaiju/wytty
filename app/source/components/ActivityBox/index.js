import React from 'react';
import Menu from '../Menu';
import PostView from './PostView';
import ReportView from './ReportView';
import ProfileView from './ProfileView';
import DefaultView from './DefaultView';
import { Dimensions } from 'react-native';
import { View, Colors } from 'react-native-ui-lib';
import { deleteNotification } from '../../screens/activity/helper';

const { width } = Dimensions.get('window');

const ActivityBox = ({ id, message, route, params, image, func}) => {

    const menuRef = React.useRef(null);
    const w = React.useMemo(() => width-40);

    const open = () => menuRef.current?.open();

    const ESelector = () => {
        switch(route){
            case 'OthersProfile':
                return <ProfileView dp={image} msg={message} params={params} width={w} open={open}/>;
            case 'Report':
                return <ReportView msg={message} width={w}/>;
            case 'default':
                return <DefaultView image={image} msg={message} width={w}/>;
            case 'Post':
                return <PostView open={open} func={func} image={image} message={message} params={params} width={w}/>;
            case 'support':
                return <ReportView support msg={message} width={w}/>;
            case 'login':
                return <ReportView login msg={message} width={w}/>;
            default: 
                return null;
        }
    };

    const options = React.useMemo(() => [
        {
            text: 'Remove',
            icon: 'trash',
            type: 'feather',
            color: Colors.red,
            onPress: () => deleteNotification(id),
        }
    ]);

    const children = React.useMemo(() => (
        <View row width={width}>
            <View centerH width={40}>
                <View width={2} flex bg-primary/>
            </View>
            <View marginB-16>
                <ESelector/>
            </View>
        </View>
    ));

    return <Menu ref={menuRef} children={children} options={options}/>;

};

export default React.memo(ActivityBox);