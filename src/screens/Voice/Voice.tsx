import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import getEnvVars, { AGORA_APP_ID } from '../../enviroments';
import AsyncStorage from '@react-native-community/async-storage';
import RtcEngine from 'react-native-agora';
import { toast } from '../../tools';
import { StyleSheet, BackHandler, AppState } from 'react-native';
import constants from '../../constants';
import { getVoicePermission } from '../../permissions';
import EmptyScreen from '../../components/EmptyScreen';
import VoiceConnection from '../../components/VoiceConnection';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';
import { useMutation } from '@apollo/react-hooks';
import { FIND_VOICE_USER, REMOVE_VOICE_WAIT } from './Voice.queries';
import { FindVoiceUser, FindVoiceUserVariables, GenderTarget, RemoveVoiceWait } from '../../types/api.d';
import VoiceFilter from '../../components/VoiceFilter';
import FloatButton from '../../components/FloatButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderBackButton } from '@react-navigation/stack';
import useInterval from '../../hooks/useInterval';

const View = styled.View``;
const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Wrapper = styled.View``;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const MatchButtonTouchable = styled.TouchableOpacity`
    padding: 16px 8px;
    margin: 16px 16px;
    border-radius: 16px;
    background-color: ${(props: any) => props.theme.lightGreyColor};
`;
const MatchButtonText = styled.Text`
    font-size: 30px;
    color: ${(props: any) => props.theme.blackColor};
`;
const FilterWrapper = styled.View`
    position: absolute;
    right: 32px;
    bottom: 32px;
`;

export type AgeType = 10 | 20 | 30 | 40 | null;
export type VoiceStateType = 'idle' | 'ready' | 'joined' | 'connected' | 'disconnected';
interface IProp {}

const Voice: React.FunctionComponent<IProp> = () => {
    const navigation = useNavigation();
    const [currentState, setCurrentState] = useState<VoiceStateType>('idle');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={() => {
                        if (currentState === 'idle') {
                            navigation.goBack();
                        } else {
                            setIsExitModalVisible(true);
                        }
                    }}
                />
            ),
        });
    }, [navigation, currentState]);

    const [loading, setLoading] = useState<boolean>(false);
    const [isPermit, setIsPermit] = useState<boolean>(false);
    const [engine, setEngine] = useState<RtcEngine>();
    const [isMatching, setIsMatching] = useState<boolean>(false);
    const [peerIds, setPeerIds] = useState<number[]>([]);

    const [isExitModalVisible, setIsExitModalVisible] = useState<boolean>(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

    const [gender, setGender] = useState<GenderTarget>(GenderTarget.any);
    const [age, setAge] = useState<AgeType>(20);
    const [distance, setDistance] = useState<number>(100);
    console.log(gender, age, distance);
    const [findVoiceUserMutation] = useMutation<FindVoiceUser, FindVoiceUserVariables>(FIND_VOICE_USER, {
        variables: { gender, age, distance },
    });
    const [RemoveVoiceWaitMutation] = useMutation<RemoveVoiceWait>(REMOVE_VOICE_WAIT);

    const initVoice = async () => {
        // Pass in the App ID to initialize the RtcEngine object.
        const engine = await RtcEngine.create(AGORA_APP_ID);
        await engine.enableAudio();
        await engine.setDefaultMuteAllRemoteAudioStreams(false);
        // Listen for the JoinChannelSuccess callback.
        // This callback occurs when the local user successfully joins the channel.
        engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('success', channel);
            setCurrentState('joined');
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
            setCurrentState('connected');
            // If new user
            if (peerIds.indexOf(uid) === -1) {
                setPeerIds([...peerIds, uid]);
            }
        });
        // Listen for the UserOffline callback.
        // This callback occurs when the remote user leaves the channel or drops offline.
        engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason);
            setCurrentState('disconnected');
            setPeerIds(peerIds.filter(id => id !== uid));
        });

        engine.addListener('NetworkQuality', (uid, txQuality, rxQuality) => {
            // agora 서버와 연결 끊김
            // console.log('NetworkQuality', uid, txQuality, rxQuality);
        });

        //engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
        setEngine(engine);
    };

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        const init = async () => {
            const permit = await getVoicePermission();
            setIsPermit(permit);
            initVoice();
        };
        init();
    }, []);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: any) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);

            if (appState.current === 'background') {
                console.log('check', currentState);
                if (currentState !== 'connected') {
                    close();
                    closeReady();
                    RemoveVoiceWaitMutation();
                }
            }
            console.log('AppState', appState.current);
        };

        // navigation.addListener('blur', () => {
        //     // 스크린 종료 시
        //     if (engine && ) {
        //         engine.destroy();
        //     }
        //     console.log('didBlur');
        // });

        AppState.addEventListener('change', handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, [currentState]);

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
                    await engine.joinChannel(data.key, channelName, null, parseInt(myId)).then(() => {
                        setCurrentState('joined');
                    });
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
            } else {
                setCurrentState('ready');
            }
            setIsMatching(true);
        } else {
            toast('접속 실패. 잠시 후 다시 시도 해주세요.');
        }
    };

    // 찾는 중 종료
    const closeReady = async () => {
        setIsMatching(false);
        setCurrentState('idle');
        await RemoveVoiceWaitMutation();
    };

    // 연결 중 종료
    const close = () => {
        if (!engine) return;
        setCurrentState('disconnected');
        engine.leaveChannel();
    };

    // 통화 중 종료
    const disconnect = () => {
        setIsMatching(false);
        setCurrentState('idle');
    };

    const restart = () => {
        if (engine) {
            engine.leaveChannel();
        }
        ready();
    };

    // 뒤로 가기 이벤트
    const exitConfirmEvent = useCallback(() => {
        if (currentState === 'ready') {
            RemoveVoiceWaitMutation();
        } else if (currentState === 'joined' || currentState === 'connected') {
            if (engine) {
                engine.leaveChannel();
            }
        }

        if (engine) {
            engine.destroy();
        }

        setIsExitModalVisible(false);
        navigation.goBack();
    }, [currentState]);

    useEffect(() => {
        if (engine) {
            if (currentState === 'disconnected') {
                engine.leaveChannel();
            }
        }
        const handleBackButtonClick = () => {
            if (currentState === 'idle') {
                return false;
            } else {
                console.log('check');
                setIsExitModalVisible(true);
                return true;
            }
        };
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }, [currentState]);

    const VoiceRenderer: React.FunctionComponent = () => {
        if (!isPermit) {
            return <EmptyScreen text="보이스톡을 이용하시려면 권한이 필요해요." />;
        } else if (isMatching) {
            return (
                <VoiceConnection
                    peerIds={peerIds}
                    close={close}
                    start={start}
                    restart={restart}
                    closeReady={closeReady}
                    disconnect={disconnect}
                    currentState={currentState}
                />
            );
        }

        return (
            <>
                <MatchButtonTouchable onPress={() => ready()}>
                    <MatchButtonText> {`매칭 시작`} </MatchButtonText>
                </MatchButtonTouchable>
                <FilterWrapper>
                    <FloatButton
                        onPress={() => setIsFilterModalVisible(true)}
                        icon={<Ionicons name="filter-outline" size={38} />}
                    />
                </FilterWrapper>
            </>
        );
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
                    close={() => setIsFilterModalVisible(false)}
                />
            </Modal>
        </Container>
    );
};

export default Voice;
