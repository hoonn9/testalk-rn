import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import Timer from '../Timer/Timer';
import Icons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles';
import { useSubscription } from '@apollo/react-hooks';
import { VoiceSubscription, VoiceSubscription_VoiceSubscription } from '../../types/api';
import { SUBSCRIBE_VOICE } from '../../screens/Voice/Voice.queries';
import { toast } from '../../tools';
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

const Text = styled.Text`
    font-size: 26px;
`;
const Touchable = styled.TouchableOpacity`
    background-color: ${(props: any) => props.theme.whiteColor};
    width: 80px;
    height: 80px;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
`;

interface IProp {
    peerIds: number[];
    close: Function;
    start: Function;
    closeReady: Function;
}

const VoiceConnection: React.FunctionComponent<IProp> = ({ peerIds, close, start, closeReady }) => {
    console.log('render', peerIds);
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
        <Container>
            {peerIds.length > 0 ? (
                <>
                    <Wrapper>
                        <Wrapper>
                            <Text>연결 성공</Text>
                        </Wrapper>
                        <Wrapper>
                            <Timer stop={false} />
                        </Wrapper>
                    </Wrapper>
                    <Wrapper>
                        <Touchable onPress={() => close()}>
                            <Icons name="call-end" size={40} color={styles.redColor} />
                        </Touchable>
                    </Wrapper>
                </>
            ) : (
                <>
                    <Wrapper>
                        <Wrapper>
                            <Text>찾는 중</Text>
                        </Wrapper>
                        <Wrapper>
                            <Text>잠시만 기다려주세요.</Text>
                        </Wrapper>
                    </Wrapper>
                    <Wrapper>
                        <Touchable onPress={() => closeReady()}>
                            <Icons name="call-end" size={40} color={styles.redColor} />
                        </Touchable>
                    </Wrapper>
                </>
            )}
        </Container>
    );
};

export default VoiceConnection;
