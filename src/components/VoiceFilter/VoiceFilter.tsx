import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import Slider from '@react-native-community/slider';
import { GenderTarget } from '../../types/api.d';
import Icon from 'react-native-vector-icons/Octicons';
import styles from '../../styles';
import RadioButton from '../RadioButton';
import { AgeType } from '../../screens/Voice/Voice';

const Container = styled.View`
    background-color: ${(props: any) => props.theme.whiteColor};
    padding-top: 36px;
`;
const Wrapper = styled.View``;
const Text = styled.Text`
    padding: 12px 16px;
    font-size: 16px;
    color: ${(props: any) => props.theme.blackColor};
`;
const RowWrapper = styled.View`
    flex-direction: row;
`;
const ConfirmTouchable = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    background-color: ${(props: any) => props.theme.lightGreyColor};
    color: ${(props: any) => props.theme.blackColor};
    border-radius: 50px;
    margin: 16px 16px;
    margin-top: 24px;
`;
const RemoveTouchable = styled.TouchableOpacity`
    position: absolute;
    top: 12px;
    right: 12px;
`;
const RowTextWrapper = styled.View`
    width: 30%;
    justify-content: center;
    align-items: center;
`;
const RowText = styled.Text`
    font-size: 16px;
    color: ${(props: any) => props.theme.blackColor};
`;

const distanceSliderStyle = {
    width: '70%',
    height: 45,
};

interface IProp {
    gender: GenderTarget;
    age: AgeType;
    distance: number;
    setGender: Function;
    setAge: Function;
    setDistance: Function;
    close: Function;
}

const minDistance = 1;
const maxDistance = 500;

interface GenderListProp {
    name: string;
    value: string;
}

const genderList: GenderListProp[] = [
    { value: GenderTarget.male, name: '남자' },
    { value: GenderTarget.female, name: '여자' },
    { value: GenderTarget.any, name: '아무나' },
];

interface AgeListProp {
    name: string;
    value: AgeType;
}

const ageList: AgeListProp[] = [
    { value: 10, name: '10대' },
    { value: 20, name: '20대' },
    { value: 30, name: '30대' },
    { value: null, name: '아무나' },
];

const VoiceFilter: React.FunctionComponent<IProp> = ({
    gender,
    age,
    distance,
    setGender,
    setAge,
    setDistance,
    close,
}) => {
    const [tempGender, setTempGender] = useState<GenderTarget>(gender);
    const [tempAge, setTempAge] = useState<AgeType>(age);
    const [tempDistance, setTempDistance] = useState<number>(distance);

    const confirmOnPress = useCallback(() => {
        setGender(tempGender);
        setAge(tempAge);
        setDistance(tempDistance);
        close();
    }, [tempGender, tempAge, tempDistance]);

    return (
        <Container>
            <Wrapper>
                <Text>상대 최대 거리</Text>
                <RowWrapper>
                    <Slider
                        style={distanceSliderStyle}
                        minimumValue={minDistance}
                        maximumValue={maxDistance}
                        thumbTintColor={styles.blackColor}
                        minimumTrackTintColor={styles.blackColor}
                        maximumTrackTintColor={styles.darkGreyColor}
                        value={tempDistance}
                        onValueChange={value => setTempDistance(value)}
                    />
                    <RowTextWrapper>
                        <RowText>{`${tempDistance.toFixed(2)} km`}</RowText>
                    </RowTextWrapper>
                </RowWrapper>
            </Wrapper>
            <Wrapper>
                <Text>성별</Text>
                <RadioButton buttons={genderList} value={tempGender} setValue={setTempGender} />
            </Wrapper>
            <Wrapper>
                <Text>연령대</Text>
                <RadioButton buttons={ageList} value={tempAge} setValue={setTempAge} />
            </Wrapper>
            <Wrapper>
                <ConfirmTouchable onPress={confirmOnPress}>
                    <Text>확인</Text>
                </ConfirmTouchable>
            </Wrapper>
            <RemoveTouchable onPress={() => close()}>
                <Icon name="x" size={26} color={styles.blackColor} />
            </RemoveTouchable>
        </Container>
    );
};

export default VoiceFilter;
