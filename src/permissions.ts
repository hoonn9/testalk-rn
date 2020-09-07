import { check, PERMISSIONS, RESULTS, requestMultiple } from 'react-native-permissions';

export const getVoicePermission = (): Promise<boolean> =>
    new Promise(async (resolve, reject) => {
        check(PERMISSIONS.ANDROID.READ_PHONE_STATE && PERMISSIONS.ANDROID.RECORD_AUDIO)
            .then(result => {
                switch (result) {
                    case RESULTS.DENIED:
                        requestMultiple([PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.READ_PHONE_STATE])
                            .then(statuses => {
                                const readPhoneState = statuses['android.permission.READ_PHONE_STATE'];
                                const recordState = statuses['android.permission.RECORD_AUDIO'];
                                if ((readPhoneState && recordState) === RESULTS.GRANTED) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            })
                            .catch(e => {
                                console.log('requestMultiple catch', e);
                            });

                        break;
                    case RESULTS.GRANTED:
                        resolve(true);
                        console.log('The permission is granted');
                        break;
                    default:
                        resolve(false);
                        break;
                }
            })
            .catch(e => {
                reject();
                return false;
            });
    });
