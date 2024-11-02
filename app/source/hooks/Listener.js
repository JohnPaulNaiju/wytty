const unsubscribe = [];

export const pushListeners = (newListener) => {
    unsubscribe.push(newListener);
};

export const clearSubscriptions = () => {
    for(let i = 0; i < unsubscribe.length; i++){
        unsubscribe[i]();
    }
};