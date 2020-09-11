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
    time: [number, number];
}

const Timer: React.FunctionComponent<IProp> = ({ time }) => {
    const showTimer = (minute: number, seconds: number) => {
        const convertM = minute >= 10 ? `${minute}` : `0${minute}`;
        const convertS = seconds >= 10 ? `${seconds}` : `0${seconds}`;
        return `${convertM}:${convertS}`;
    };

    return (
        <Container>
            <Wrapper>
                <Text>{showTimer(time[0], time[1])}</Text>
            </Wrapper>
        </Container>
    );
};

export default Timer;
