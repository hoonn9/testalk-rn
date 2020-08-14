import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import {getAge, dateSimpleConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';

const Container = styled.View`
  flex-direction: row;
`;
const Wrapper = styled.View`
  justify-content: center;
  background-color: #ddd;
  padding: 1px 0px;
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
  background-color: #ddd;
  padding: 0px 8px;
`;
const InfoWrapper = styled.View``;
const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  background-color: #ddd;
`;
const FirstText = styled.Text`
  font-size: 16px;
`;
const SecondText = styled.Text`
  font-size: 15px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
const ThirdText = styled.Text`
  font-size: 13px;
`;

interface IProp {
  id: number;
  title: string;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: string;
  updatedAt: string | undefined | null;
  onSelected?: Function;
  imageOnPress?: Function;
}

const PostRow: React.FunctionComponent<IProp> = ({
  id,
  title,
  nickName,
  birth,
  gender,
  profilePhoto,
  updatedAt,
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
            profilePhoto,
          })
        }>
        <InfoWrapper>
          <Wrapper>
            <FirstText>{title}</FirstText>
          </Wrapper>
          <Wrapper>
            <SecondText>
              {nickName} {birth ? getAge(birth) : '??'} {gender}
            </SecondText>
          </Wrapper>
          <Wrapper>
            <ThirdText>
              {updatedAt ? dateSimpleConverter(updatedAt) : '??'}
            </ThirdText>
          </Wrapper>
        </InfoWrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(PostRow);
