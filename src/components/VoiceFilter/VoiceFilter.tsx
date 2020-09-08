import React, { useState } from 'react';
import styled from 'styled-components/native';
import Slider from '@react-native-community/slider';
import { GenderTarget } from '../../types/api.d';

const Container = styled.View``;
const Text = styled.Text``;

interface IProp {
    gender: GenderTarget;
    age: number;
    distance: number;
    setGender: Function;
    setAge: Function;
    setDistance: Function;
}

const VoiceFilter: React.FunctionComponent<IProp> = ({ gender, age, distance, setGender, setAge, setDistance }) => {
    return (
        <Container>
            <Text>sdas</Text>
            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />
        </Container>
    );
};

export default VoiceFilter;
