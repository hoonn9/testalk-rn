import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import getEnvVars, { AGORA_APP_ID } from '../../enviroments';
import AsyncStorage from '@react-native-community/async-storage';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import { ScrollView } from 'react-native-gesture-handler';
import { toast } from '../../tools';
import { PermissionsAndroid, StyleSheet, BackHandler } from 'react-native';
import constants from '../../constants';
import { requestNotifications, check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { getVoicePermission } from '../../permissions';
import EmptyScreen from '../../components/EmptyScreen';
import { RtcStatsCallback, EmptyCallback } from 'react-native-agora/lib/src/RtcEvents';
import VoiceConnection from '../../components/VoiceConnection';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';
import { useMutation } from '@apollo/react-hooks';
import { FIND_VOICE_USER } from './Voice.queries';
import { FindVoiceUser, FindVoiceUserVariables, GenderTarget } from '../../types/api.d';
import VoiceFilter from '../../components/VoiceFilter';

const View = styled.View``;
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Wrapper = styled.View``;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const VoiceRowTouchable = styled.TouchableOpacity`
    padding: 16px 8px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    margin: 8px 16px;
    border-color: ${(props: any) => props.theme.darkGreyColor};
`;

interface IProp {}

const styleSheets = StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: constants.width,
        height: constants.height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5,
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
});

const Voice: React.FunctionComponent<IProp> = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [isPermit, setIsPermit] = useState<boolean>(false);
    const [engine, setEngine] = useState<RtcEngine>();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [joinSucceed, setJoinSucceed] = useState<boolean>();
    const [peerIds, setPeerIds] = useState<number[]>([]);

    const [isExitModalVisible, setIsExitModalVisible] = useState<boolean>(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

    const [gender, setGender] = useState<GenderTarget>(GenderTarget.male);
    const [age, setAge] = useState<number>(20);
    const [distance, setDistance] = useState<number>(5000);

    const [findVoiceUserMutation] = useMutation<FindVoiceUser, FindVoiceUserVariables>(FIND_VOICE_USER, {
        variables: { gender, age, distance },
    });

    const initVoice = async () => {
        // Pass in the App ID to initialize the RtcEngine object.
        const engine = await RtcEngine.create(AGORA_APP_ID);
        await engine.enableAudio();
        await engine.setDefaultMuteAllRemoteAudioStreams(false);
        // Listen for the JoinChannelSuccess callback.
        // This callback occurs when the local user successfully joins the channel.
        engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('success', channel);
            setJoinSucceed(true);
        });

        engine.addListener('LeaveChannel', stats => {
            // agora 서버와 연결 끊김
            console.log('LeaveChannel', stats);
        });

        engine.addListener('ConnectionLost', () => {
            // agora 서버와 연결 끊김
        });
        // Listen for the UserJoined callback.
        // This callback occurs when the remote user successfully joins the channel.
        engine.addListener('UserJoined', (uid, elapsed) => {
            console.log('userjoined', uid);
            // If new user
            if (peerIds.indexOf(uid) === -1) {
                setPeerIds([...peerIds, uid]);
            }
        });
        // Listen for the UserOffline callback.
        // This callback occurs when the remote user leaves the channel or drops offline.
        engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason);
            setPeerIds(peerIds.filter(id => id !== uid));
        });

        engine.addListener('NetworkQuality', (uid, txQuality, rxQuality) => {
            // agora 서버와 연결 끊김
            console.log('NetworkQuality', uid, txQuality, rxQuality);
        });

        //engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
        setEngine(engine);
    };

    useEffect(() => {
        const init = async () => {
            const permit = await getVoicePermission();
            setIsPermit(permit);
            initVoice();
        };
        init();
        navigation.addListener('blur', () => {
            // 스크린 종료 시
            if (engine && !joinSucceed) {
                engine.destroy();
            }
            console.log('didBlur');
        });
    }, []);

    const start = useCallback(
        async channelName => {
            if (!engine) {
                console.log('not engine');
                return;
            }
            toast('시작');
            const jwt = await AsyncStorage.getItem('jwt');
            const myId = await AsyncStorage.getItem('userId');
            if (jwt && myId) {
                const data = await axios
                    .get(getEnvVars().apiUrl + 'generateRtcToken', {
                        params: { uid: myId, channelName: channelName },
                        headers: { 'X-JWT': jwt },
                    })
                    .then(e => {
                        return e.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });
                if (data && data.key) {
                    console.log(data.key);
                    await engine.enableAudio();
                    await engine.enableLocalAudio(true);
                    await engine.joinChannel(data.key, channelName, null, parseInt(myId));
                } else {
                    toast('인증 실패.');
                }
            } else {
                toast('해당 계정의 인증을 실패하였습니다.');
            }
        },
        [engine],
    );

    const ready = async () => {
        const { data } = await findVoiceUserMutation();
        console.log(data);
        if (data && data.FindVoiceUser && data.FindVoiceUser.ok) {
            if (data.FindVoiceUser.channelName) {
                start(data.FindVoiceUser.channelName);
            }
            setIsReady(true);
        } else {
            toast('접속 실패. 잠시 후 다시 시도 해주세요.');
        }
    };

    const closeReady = async () => {
        setIsReady(false);
    };

    const close = () => {
        if (!engine) return;
        toast('종료');
        console.log('close');
        engine.leaveChannel();
        setIsReady(false);
    };

    useEffect(() => {
        const handleBackButtonClick = () => {
            if (joinSucceed) {
                console.log('check');
                setIsExitModalVisible(true);
                return true;
            } else {
                return false;
            }
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, [joinSucceed]);

    const VoiceRenderer: React.FunctionComponent = () => {
        if (!isPermit) {
            return (
                <Container>
                    <EmptyScreen text="보이스톡을 이용하시려면 권한이 필요해요." />
                </Container>
            );
        } else if (isReady) {
            return (
                <Container>
                    <VoiceConnection peerIds={peerIds} close={close} start={start} closeReady={closeReady} />
                </Container>
            );
        }

        return (
            <Container style={styleSheets.max}>
                <Wrapper>
                    <Touchable onPress={() => ready()} style={styleSheets.button}>
                        <Text style={styleSheets.buttonText}> {`매칭 시작`} </Text>
                    </Touchable>
                    <Touchable onPress={() => setIsFilterModalVisible(true)}>
                        <Text>필터</Text>
                    </Touchable>
                </Wrapper>
            </Container>
        );
    };

    const exitConfirmEvent = () => {
        // 연결 중 종료
        if (engine) {
            engine.leaveChannel();
            engine.destroy();
        }
        setIsExitModalVisible(false);
        navigation.goBack();
    };

    // Render
    return (
        <Container>
            <VoiceRenderer />
            <Modal
                isVisible={isExitModalVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}
                swipeDirection={['down']}
                onSwipeComplete={() => setIsExitModalVisible(false)}>
                <ModalSelector
                    description={'연결을 종료하시겠어요?'}
                    confirmEvent={exitConfirmEvent}
                    confirmTitle="네"
                    cancelEvent={() => setIsExitModalVisible(false)}
                />
            </Modal>
            <Modal
                isVisible={isFilterModalVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}
                swipeDirection={['down']}>
                <VoiceFilter
                    gender={gender}
                    age={age}
                    distance={distance}
                    setGender={setGender}
                    setAge={setAge}
                    setDistance={setDistance}
                />
            </Modal>
        </Container>
    );
};

export default Voice;
