import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import {getAge, dateSimpleConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';

const Container = styled.View`
  flex-direction: row;
  background-color: ${(props: any) => props.theme.whiteColor};
  padding: 6px 0px;
`;
const Wrapper = styled.View`
  justify-content: center;
  padding: 1.5px 0px;
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 0px 8px;
`;
const InfoWrapper = styled.View``;
const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;
const FirstText = styled.Text`
  font-size: 15px;
`;
const SecondText = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
const ThirdText = styled.Text`
  font-size: 13px;
`;

interface IProp {
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  intro: string;
  profilePhoto: string;
  updatedAt: string | undefined | null;
  lastLat: number | undefined | null;
  lastLng: number | undefined | null;
  getDistance: Function;
  onSelected: Function;
  imageOnPress: Function;
}

const PeopleRowItem: React.FunctionComponent<IProp> = ({
  id,
  intro,
  nickName,
  birth,
  gender,
  profilePhoto,
  updatedAt,
  lastLat,
  lastLng,
  getDistance,
  onSelected = () => null,
  imageOnPress = () => null,
}) => {
  return (
    <Container>
      <ImageTouchable activeOpacity={1} onPress={() => imageOnPress(id)}>
        <PeoplePhoto uri={profilePhoto} gender={gender} />
      </ImageTouchable>
      <Touchable
        activeOpacity={1}
        onPress={() =>
          onSelected(id, {
            nickName,
            birth,
            gender,
            intro,
            profilePhoto,
          })
        }>
        <InfoWrapper>
          <Wrapper>
            <FirstText>{intro ? intro : '안녕하세요. 반갑습니다'}</FirstText>
          </Wrapper>
          <Wrapper>
            <SecondText>
              {nickName} {birth ? getAge(birth) : '??'} {gender}
            </SecondText>
          </Wrapper>
          <Wrapper>
            <ThirdText>
              {`${getDistance(lastLat, lastLng)}, `}
              {updatedAt ? dateSimpleConverter(updatedAt) : '??'}
            </ThirdText>
          </Wrapper>
        </InfoWrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(PeopleRowItem);
