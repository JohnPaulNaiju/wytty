import React from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const isAndroid = Platform.OS==='android';

export const UploadContext = React.createContext({});

export const UploadProvider = ({ children }) => {

    const abort = React.useRef(false);

    const [file, setFile] = React.useState({
        name: null,
        mime: null,
        size: null,
        uri: null,
    });

    const [progress, setProgress] = React.useState(0);

    const abortTask = () => {
        abort.current = true;
    };

    const uploadToCloud = async(file, folderId) => {
        try{
            setProgress(1);
            const firebase = require('./useData');

            const metadata = {
                contentType: file?.mime || undefined,
            };

            const uploadURI = isAndroid?file?.uri:file?.uri?.replace('file://','');
            const path = `users/${firebase.auth.currentUser.uid}/files/${file?.name}`;

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = () => {
                    Toast.show({ text1: 'Network request failed' });
                    reject();
                };
                xhr.responseType = "blob";
                xhr.open("GET", uploadURI, true);
                xhr.send(null);
            });

            const storageRef = ref(firebase.storage, path);
            const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

            uploadTask.on('state_changed', (snapshot) => {

                if(abort.current){
                    uploadTask.cancel();
                    abort.current = false;
                    return;
                }

                const p = (snapshot.bytesTransferred/snapshot.totalBytes)*100 || 1;
                setProgress(p);

            }, (e) => {
                setProgress(0);
                if(e.code==='storage/canceled'){
                    Toast.show({ text1: 'Upload canceled' });
                    return;
                }
                Toast.show({ text1: 'Error uploading your file' });

            }, () => {

                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    const { updateFolder } = require('../screens/cloud/helper');
                    await updateFolder(folderId, file?.name, file?.mime, file?.size, downloadURL);
                    setProgress(0);
                });

            });
        }catch{
            abortTask();
        }
    };

    const contextValue = { file, progress, setFile, uploadToCloud, abortTask };

    return (

        <UploadContext.Provider value={contextValue}>
            {children}
        </UploadContext.Provider>

    );

};

export const useUpload = () => React.useContext(UploadContext);