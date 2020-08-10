import React from 'react';
import styled from 'styled-components/native';
import {dateMessageConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  height: 80px;
`;
const Touchable = styled.TouchableOpacity`
  width: 100%;
  padding: 4px 8px;
`;
const Wrapper = styled.View`
  flex-direction: row;
  height: 100%;
`;
const DateWrapper = styled.View`
  flex: 3;
  justify-content: flex-end;
`;
const ContentWrapper = styled.View`
  flex: 5;
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
  background-color: #ddd;
  padding: 0px 8px;
`;
const DateText = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
const NameText = styled.Text`
  font-weight: 700;
  font-size: 15px;
`;
const ContentText = styled.Text`
  font-size: 14px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
interface IProp {
  id: number;
  userId: number;
  chatId: number;
  content: string;
  createdAt: string;
  nickName: string;
  profilePhoto: string;
  gender: string;
  birth: number;
  navigateCallback: (
    userId: number,
    userInfo: {
      nickName: string;
      birth: number;
      gender: string;
      intro: string;
      profilePhoto: string;
    },
  ) => void | undefined;
  imageOnPress: Function;
}

const ChatRoomRow: React.FunctionComponent<IProp> = ({
  id,
  userId,
  chatId,
  content,
  createdAt,
  nickName,
  profilePhoto,
  gender,
  birth,
  navigateCallback = () => null,
  imageOnPress = () => null,
}) => {
  return (
    <Container>
      <ImageTouchable onPress={() => imageOnPress(userId)}>
        <PeoplePhoto uri={profilePhoto} gender={gender} />
      </ImageTouchable>
      <Touchable
        activeOpacity={1}
        onPress={() =>
          navigateCallback(userId, {
            nickName,
            birth,
            gender,
            intro: '',
            profilePhoto,
          })
        }>
        <Wrapper>
          <ContentWrapper>
            <NameText>{nickName}</NameText>
            <ContentText>{content}</ContentText>
          </ContentWrapper>
          <DateWrapper>
            <DateText>{dateMessageConverter(parseInt(createdAt))}</DateText>
          </DateWrapper>
        </Wrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(ChatRoomRow);
