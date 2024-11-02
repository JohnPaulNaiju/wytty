import React from 'react';
import ChatSkeleton from './ChatSkeleton';
import PostSkeleton from './PostSkeleton';
import PollSkeleton from './PollSkeleton';
import FileSkeleton from './FileSkeleton';
import MessageSkeleton from './MessageSkeleton';
import TribeBoxSkeleton from './TribeBoxSkeleton';

const Skeleton = ({type}) => {

    if(type==='post') return <PostSkeleton/>;
    else if(type==='tribe') return <TribeBoxSkeleton/>;
    else if(type==='msg') return <MessageSkeleton/>;
    else if(type==='poll') return <PollSkeleton/>;
    else if(type==='file') return <FileSkeleton/>;
    else if(type==='chat') return <ChatSkeleton/>;
    else return null;

};

export default React.memo(Skeleton);