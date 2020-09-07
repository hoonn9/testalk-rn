import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import BackgroundTimer from 'react-native-background-timer';

const Container = styled.View``;
const Wrapper = styled.View``;

const Text = styled.Text`
    font-size: 42px;
    font-weight: 600;
    color: ${(props: any) => props.theme.blackColor};
`;

interface IProp {
    stop: boolean;
}

const Timer: React.FunctionComponent<IProp> = ({ stop }) => {
    const [minute, setMinute] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    useEffect(() => {
        BackgroundTimer.runBackgroundTimer(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        if (stop) {
            BackgroundTimer.stopBackgroundTimer();
        }
    }, [stop]);

    useEffect(() => {
        if (seconds >= 60) {
            setMinute(prev => prev + 1);
            setSeconds(0);
        }
    }, [seconds]);

    const showTimer = (minute: number, seconds: number) => {
        const convertM = minute >= 10 ? `${minute}` : `0${minute}`;
        const convertS = seconds >= 10 ? `${seconds}` : `0${seconds}`;
        return `${convertM}:${convertS}`;
    };

    return (
        <Container>
            <Wrapper>
                <Text>{showTimer(minute, seconds)}</Text>
            </Wrapper>
        </Container>
    );
};

export default Timer;
