import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet, GestureResponderEvent} from 'react-native';
import {getAge, dateSimpleConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';
import RowSeparator from '../RowSeparator';

const RowContainer = styled.View`
  flex-direction: row;
`;
const Container = styled.View`
  background-color: ${(props: any) => props.theme.whiteColor};
  padding: 6px 8px;
  margin: 12px;
  border: ${(props: any) => props.theme.lightGreyColor};
  border-radius: 12px;
`;
const Wrapper = styled.View`
  justify-content: center;
  padding: 1px 0px;
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
`;
const InfoContainer = styled.View``;
const InfoWrapper = styled.View``;
const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;
const TitleText = styled.Text`
  font-size: 16px;
  padding: 8px;
`;
const ContentText = styled.Text`
  font-size: 14px;
`;
const SecondText = styled.Text`
  font-size: 15px;
  color: ${(props: any) => props.theme.darkGreyColor};
  padding: 0px 8px;
`;
const ThirdText = styled.Text`
  font-size: 13px;
  padding: 0px 8px;
`;

interface IProp {
  id: number;
  userId: number;
  title: string;
  content: string;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: string;
  updatedAt: string | undefined | null;
  onSelected: ((event: GestureResponderEvent) => void) | undefined;
  imageOnPress: ((event: GestureResponderEvent) => void) | undefined;
}

const PostRow: React.FunctionComponent<IProp> = ({
  id,
  title,
  content,
  nickName,
  birth,
  gender,
  profilePhoto,
  updatedAt,
  onSelected = () => null,
  imageOnPress = () => null,
}) => {
  return (
    <Container
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}>
      <RowContainer>
        <ImageTouchable activeOpacity={1} onPress={imageOnPress}>
          <PeoplePhoto uri={profilePhoto} gender={gender} size={50} />
        </ImageTouchable>
        <Touchable activeOpacity={1} onPress={onSelected}>
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
        </Touchable>
      </RowContainer>
      <InfoContainer>
        <InfoWrapper>
          <Wrapper>
            <TitleText>{title}</TitleText>
          </Wrapper>
          <RowSeparator />
        </InfoWrapper>
      </InfoContainer>
    </Container>
  );
};

export default React.memo(PostRow);
