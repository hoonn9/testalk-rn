import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import Timer from '../Timer/Timer';
import Icons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles';
import { useSubscription } from '@apollo/react-hooks';
import { VoiceSubscription, VoiceSubscription_VoiceSubscription } from '../../types/api';
import { SUBSCRIBE_VOICE } from '../../screens/Voice/Voice.queries';
import { toast } from '../../tools';
import { VoiceStateType } from '../../screens/Voice/Voice';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Wrapper = styled.View`
    flex: 0.5;
    justify-content: center;
    align-items: center;
`;
const PrimaryText = styled.Text`
    font-size: 26px;
    text-align: center;
    font-weight: 700;
    color: ${(props: any) => props.theme.blackColor};
`;

const SubText = styled.Text`
    font-size: 21px;
    text-align: center;
    color: ${(props: any) => props.theme.blackColor};
`;
const Text = styled.Text`
    font-size: 21px;
    text-align: center;
    color: ${(props: any) => props.theme.blackColor};
`;
const Touchable = styled.TouchableOpacity`
    background-color: ${(props: any) => props.theme.whiteColor};
    width: 80px;
    height: 80px;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
`;

interface ControllerProp {
    close: Function;
    start: Function;
    restart: Function;
    closeReady: Function;
    disconnect: Function;
    currentState: VoiceStateType;
    time: [number, number];
    tokenWarning: boolean;
}

interface IProp extends ControllerProp {
    peerIds: number[];
}

interface MatchingProp {
    start: Function;
    closeReady: Function;
}

interface ConnectedProp {
    close: Function;
    time: [number, number];
    tokenWarning: boolean;
}

interface DisconnectedProp {
    disconnect: Function;
}
interface JoinedProp {
    restart: Function;
    close: Function;
}

const VoiceConnection: React.FunctionComponent<IProp> = ({
    peerIds,
    close,
    start,
    restart,
    closeReady,
    disconnect,
    currentState,
    time,
    tokenWarning,
}) => {
    return (
        <Container>
            <VoiceRenderController
                close={close}
                start={start}
                restart={restart}
                closeReady={closeReady}
                disconnect={disconnect}
                currentState={currentState}
                time={time}
                tokenWarning={tokenWarning}
            />
        </Container>
    );
};

const VoiceRenderController: React.FunctionComponent<ControllerProp> = ({
    currentState,
    close,
    start,
    restart,
    disconnect,
    closeReady,
    time,
    tokenWarning,
}) => {
    switch (currentState) {
        case 'joined':
            return <VoiceJoined close={close} restart={restart} />;
        case 'connected':
            return <VoiceConnected close={close} time={time} tokenWarning={tokenWarning} />;
        case 'disconnected':
            return <VoiceDisconnected disconnect={disconnect} />;
        default:
            return <VoiceReady start={start} closeReady={closeReady} />;
    }
};

const VoiceReady: React.FunctionComponent<MatchingProp> = ({ start, closeReady }) => {
    const { data: subscribeData, loading: subscribeLoading, error: subscribeError } = useSubscription<
        VoiceSubscription,
        VoiceSubscription_VoiceSubscription
    >(SUBSCRIBE_VOICE);

    // Subscribe Chat
    useEffect(() => {
        if (subscribeData) {
            console.log(subscribeData);
            if (subscribeData.VoiceSubscription) {
                const { channelName, createdAt } = subscribeData.VoiceSubscription;
                console.log(channelName, createdAt);
                start(channelName);
                if (channelName) {
                } else {
                    toast('데이터 수신 중 오류가 발생하였습니다.');
                }
            }
        }
    }, [subscribeData]);

    return (
        <>
            <Wrapper>
                <Wrapper>
                    <PrimaryText>찾는 중</PrimaryText>
                </Wrapper>
                <Wrapper>
                    <SubText>잠시만 기다려주세요.</SubText>
                </Wrapper>
            </Wrapper>
            <Wrapper>
                <Touchable onPress={() => closeReady()}>
                    <Icons name="call-end" size={40} color={styles.redColor} />
                </Touchable>
            </Wrapper>
        </>
    );
};

type TimeStateType = 'default' | 'pain' | 'close';

const VoiceJoined: React.FunctionComponent<JoinedProp> = ({ close, restart }) => {
    const [timeState, setTimeState] = useState<TimeStateType>('default');

    useEffect(() => {
        let ms = 0;
        const msUnit = 100;
        const waitTime = 8000;

        const painTime = 4000;
        const closeTime = 6000;

        const connectionWaitTimer = setInterval(() => {
            ms += msUnit;

            if (ms === painTime) {
                setTimeState('pain');
            } else if (ms === closeTime) {
                setTimeState('close');
            }

            if (ms >= waitTime) {
                restart();
                clearInterval(connectionWaitTimer);
            }
        }, msUnit);

        return () => clearInterval(connectionWaitTimer);
    }, []);

    const timeStateRenderer = (timeState: TimeStateType) => {
        switch (timeState) {
            case 'default':
                return '상대와 연결 중이에요';
            case 'pain':
                return '상대가 응답하지 않고 있어요.';
            case 'close':
                return '연결이 끊어졌어요. \n다른 사람과 연결 해드릴게요.';
            default:
                return '상대와 연결 중이에요';
        }
    };

    return (
        <>
            <Wrapper>
                <Wrapper>
                    <PrimaryText>상대를 찾았습니다.</PrimaryText>
                </Wrapper>
                <Wrapper>
                    <SubText>{timeStateRenderer(timeState)}</SubText>
                </Wrapper>
            </Wrapper>
            <Wrapper>
                <Touchable onPress={() => close()}>
                    <Icons name="call-end" size={40} color={styles.redColor} />
                </Touchable>
            </Wrapper>
        </>
    );
};

const VoiceConnected: React.FunctionComponent<ConnectedProp> = ({ close, time, tokenWarning }) => {
    const [isWarnShow, setIsWarnShow] = useState<boolean>(false);
    useEffect(() => {
        if (tokenWarning && !isWarnShow) {
            toast('30초 남았습니다.');
            setIsWarnShow(true);
        }
    }, [tokenWarning, isWarnShow]);
    return (
        <>
            <Wrapper>
                <Wrapper>
                    <PrimaryText>연결 성공</PrimaryText>
                </Wrapper>
                <Wrapper>
                    <Timer time={time} />
                </Wrapper>
            </Wrapper>
            <Wrapper>
                <Touchable onPress={() => close()}>
                    <Icons name="call-end" size={40} color={styles.redColor} />
                </Touchable>
            </Wrapper>
        </>
    );
};

const VoiceDisconnected: React.FunctionComponent<DisconnectedProp> = ({ disconnect }) => {
    return (
        <>
            <Wrapper>
                <Wrapper>
                    <PrimaryText>통화 종료</PrimaryText>
                </Wrapper>
                <Wrapper>
                    <SubText>통화가 종료 되었습니다.</SubText>
                </Wrapper>
            </Wrapper>
            <Wrapper>
                <Touchable onPress={() => disconnect()}>
                    <Text>완료</Text>
                </Touchable>
            </Wrapper>
        </>
    );
};

export default React.memo(VoiceConnection);
