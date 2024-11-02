import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const useAnimation = () => {

    const ReplyHeight = useSharedValue(0);
    const ReplyOpacity = useSharedValue(0);
    const StickerHeight = useSharedValue(0);

    const ReplyStyle = useAnimatedStyle(() => ({ maxHeight: ReplyHeight.value, opacity: ReplyOpacity.value }));
    const StickerStyle = useAnimatedStyle(() => ({ height: StickerHeight.value }));

    const Grow = () => {
        requestAnimationFrame(() => {
            ReplyHeight.value = withTiming(100, { duration: 500 });
            ReplyOpacity.value = withTiming(1, { duration: 500 });
        });
    };

    const UnGrow = () => {
        requestAnimationFrame(() => {
            ReplyHeight.value = withTiming(0, { duration: 500 });
            ReplyOpacity.value = withTiming(0, { duration: 500 });
        });
    };

    const showSticker = () => {
        requestAnimationFrame(() => {
            StickerHeight.value = withTiming(200, { duration: 300 });
        });
    };

    const hideSticker = () => {
        requestAnimationFrame(() => {
            StickerHeight.value = withTiming(0, { duration: 300 });
        });
    };

    return { 
        ReplyStyle, 
        StickerStyle, 
        Grow, 
        UnGrow, 
        showSticker, 
        hideSticker, 
    };

};

export default useAnimation;