import Toast from 'react-native-root-toast';
import { Vibration } from 'react-native';
import constants from './constants';

export const toast = (
    message: string,
    position?: number,
    onShow?: Function,
    onShown?: Function,
    onHide?: Function,
    onHidden?: Function,
) => {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: position || constants.height / 4.5,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        onShow: onShow,
        onShown: onShown,
        onHide: onHide,
        onHidden: onHidden,
    });
};

const ONE_SECOND_IN_MS = 200;

export const vibration = () => Vibration.vibrate(ONE_SECOND_IN_MS);
