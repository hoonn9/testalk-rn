import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useMutation } from '@apollo/react-hooks';
import { request, requestNotifications, PERMISSIONS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { SetUserNotify, SetUserNotifyVariables } from '../../types/api';
import { toast } from '../../tools';
import { SET_USER_NOTIFY } from './Permission.queries';
import AuthButton from '../../components/AuthButton';
import { usePermit } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';

const Container = styled.SafeAreaView`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const View = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
`;

const IndicatorView = styled.View`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProp {}

const Permission: React.FunctionComponent<IProp> = () => {
    const navigation = useNavigation();
    const [isRequested, setIsRequested] = useState<boolean>(false);
    const [isLocationGranted, setIsLocationGranted] = useState<boolean>(false);
    const [isNotifyGranted, setIsNotifyGranted] = useState<boolean>(false);
    const [setNotifyId] = useMutation<SetUserNotify, SetUserNotifyVariables>(SET_USER_NOTIFY);
    const [loading, setLoading] = useState<boolean>(false);
    const confirmPermit = usePermit();
    const getPermission = () => {
        setLoading(true);
        new Promise(async (resolve, reject) => {
            const notifyStatus = await requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
                return status;
            });
            if (notifyStatus !== 'granted') {
                toast('앱을 이용하시려면 알림 권한이 필요해요!');
                setLoading(false);
                return;
            }
            // FCM TOKEN 저장
            messaging()
                .getToken()
                .then(async token => {
                    const { data } = await setNotifyId({
                        variables: {
                            token,
                        },
                    });
                    if (data && data.SetUserNotify.ok) {
                        setIsNotifyGranted(true);
                        resolve();
                    } else {
                        toast('권한을 얻는 데 실패했어요. 다시 시도해주세요.');
                        setLoading(false);
                    }
                });
        }).then(async () => {
            const locationStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                ({ status, settings }: any) => {
                    return status;
                },
            );
            if (locationStatus !== 'granted') {
                toast('앱을 이용하시려면 위치 권한이 필요해요!');
                setLoading(false);
                return;
            }
            setIsLocationGranted(true);
            confirmPermit();
        });
    };

    //   useEffect(() => {
    //     if (isLocationGranted && isNotifyGranted) {
    //       console.log("체크~");
    //       const confirmPermit = usePermit();
    //       confirmPermit();
    //     }
    //   }, [isLocationGranted, isNotifyGranted]);

    //console.log(listData);
    return (
        <Container>
            <View>
                <Text>{"서비스를 이용하기 위해 '알림', '위치' 권한이 필요합니다."}</Text>
                <Text>{'아래 버튼을 눌러 권한을 허용해주세요.'}</Text>
            </View>
            <View>
                <AuthButton onClick={getPermission} text="권한 요청" loading={loading} />
            </View>
            <View>
                <Text>{'거부하셨던 분들은 설정 - 앱에서 수동으로 허용 해주셔야 합니다.'}</Text>
                <Text>{'재설치 해주셔야 합니다.'}</Text>
            </View>
        </Container>
    );
};

export default Permission;
