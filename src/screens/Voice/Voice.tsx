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

    const [uid, setUid] = useState<number>(0);
    // const [initialized, setInitialized] = useState<string>();
    const [engine, setEngine] = useState<RtcEngine>();
    const [channelName, setChannelName] = useState<string>('test');
    const [joinSucceed, setJoinSucceed] = useState<boolean>();
    const [peerIds, setPeerIds] = useState<number[]>([]);

    const [isExitModalVisible, setIsExitModalVisible] = useState<boolean>(false);

    // const renderVideos = () => {
    //     return joinSucceed ? (
    //         <View style={styleSheets.fullView}>
    //             <RtcLocalView.SurfaceView
    //                 style={{ flex: 1 }}
    //                 channelId={channelName}
    //                 renderMode={VideoRenderMode.Hidden}
    //             />
    //             {renderRemoteVideos()}
    //         </View>
    //     ) : null;
    // };

    const renderRemoteVideos = () => {
        return (
            <ScrollView
                style={styleSheets.remoteContainer}
                contentContainerStyle={{ paddingHorizontal: 2.5 }}
                horizontal={true}>
                {peerIds.map((value, index, array) => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styleSheets.remote}
                            uid={value}
                            channelId={channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true}
                        />
                    );
                })}
            </ScrollView>
        );
    };

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

    const join = useCallback(async () => {
        if (!engine) {
            console.log('not engine');
            return;
        }
        toast('시작');
        const jwt = await AsyncStorage.getItem('jwt');
        const { key } = await axios
            .get(getEnvVars().apiUrl + 'generateRtcToken', {
                params: { uid: uid, channelName: channelName },
                headers: { 'X-JWT': jwt },
            })
            .then(e => {
                return e.data;
            })
            .catch(e => {
                console.log(e);
            });
        console.log(key);
        await engine.enableAudio();
        await engine.enableLocalAudio(true);
        await engine.joinChannel(key, channelName, null, uid);
    }, [uid, channelName, engine]);

    const close = () => {
        if (!engine) return;
        toast('종료');
        console.log('close');
        engine.leaveChannel();
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
    }, []);

    const VoiceRenderer: React.FunctionComponent = () => {
        if (!isPermit) {
            return (
                <Container>
                    <EmptyScreen text="보이스톡을 이용하시려면 권한이 필요해요." />
                </Container>
            );
        } else if (joinSucceed) {
            return (
                <Container>
                    <VoiceConnection peerIds={peerIds} close={close} />
                </Container>
            );
        }

        return (
            <Container style={styleSheets.max}>
                <Wrapper>
                    <Touchable onPress={() => join()} style={styleSheets.button}>
                        <Text style={styleSheets.buttonText}> {`매칭 시작`} </Text>
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
        </Container>
    );
};

export default Voice;
