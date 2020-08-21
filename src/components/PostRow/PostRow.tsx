import React from 'react';
import styled from 'styled-components/native';
import {GestureResponderEvent} from 'react-native';
import {getAge, dateSimpleConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';
import RowSeparator from '../RowSeparator';
import Icon from 'react-native-vector-icons/Ionicons';

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
  font-size: 15px;
  padding: 8px;
  color: ${(props: any) => props.theme.blackColor};
`;
const SecondText = styled.Text`
  font-size: 15px;
  padding: 0px 8px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
const ThirdText = styled.Text`
  font-size: 13px;
  padding: 0px 8px;
  color: ${(props: any) => props.theme.blackColor};
`;
const CountWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 4px;
`;
const CountText = styled.Text`
  font-size: 11px;
  color: ${(props: any) => props.theme.darkGreyColor};
  padding: 0px 4px;
`;

interface IProp {
  id: number;
  userId: number;
  title: string;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: string;
  createdAt: string;
  readCount: number;
  likeCount: number;
  commentCount: number;
  onSelected: ((event: GestureResponderEvent) => void) | undefined;
  imageOnPress: ((event: GestureResponderEvent) => void) | undefined;
}

const PostRow: React.FunctionComponent<IProp> = ({
  id,
  title,
  nickName,
  birth,
  gender,
  profilePhoto,
  createdAt,
  readCount,
  likeCount,
  commentCount,
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
              {nickName} {getAge(birth)} {gender}
            </SecondText>
          </Wrapper>
          <Wrapper>
            <ThirdText>{dateSimpleConverter(createdAt)}</ThirdText>
          </Wrapper>
        </Touchable>
      </RowContainer>
      <InfoContainer>
        <Touchable activeOpacity={1} onPress={onSelected}>
          <InfoWrapper>
            <Wrapper>
              <TitleText>{title}</TitleText>
            </Wrapper>
            <RowSeparator />
            <CountWrapper>
              <Icon name="heart-sharp" />
              <CountText>{likeCount}</CountText>
              <Icon name="chatbox-ellipses-outline" />
              <CountText>{commentCount}</CountText>
              <Icon name="eye-outline" />
              <CountText>{readCount}</CountText>
            </CountWrapper>
          </InfoWrapper>
        </Touchable>
      </InfoContainer>
    </Container>
  );
};

export default React.memo(PostRow);
