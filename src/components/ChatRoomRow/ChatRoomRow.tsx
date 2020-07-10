import React from 'react';
import styled from 'styled-components/native';
import {Image, StyleSheet} from 'react-native';
import {dateMessageConverter} from '../../utils';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
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
const ImageWrapper = styled.View`
  justify-content: center;
  background-color: #ddd;
  padding: 0px 8px;
`;
const Text = styled.Text``;
const NameText = styled.Text`
  font-weight: 700;
`;
const ContentText = styled.Text``;
interface IProp {
  id: number;
  userId: number;
  chatId: number;
  content: string;
  createdAt: string;
  requestTime: string;
  navigateCallback: (userId: number) => void | undefined;
}
const styles = () =>
  StyleSheet.create({
    image: {
      width: 65,
      height: 65,
      borderRadius: 50 / 2,
      borderWidth: 1,
    },
  });
const ChatRoomRow: React.FunctionComponent<IProp> = ({
  id,
  userId,
  chatId,
  content,
  createdAt,
  requestTime,
  navigateCallback = () => null,
}) => {
  return (
    <Container>
      <ImageWrapper>
        <Image
          source={{uri: 'https://i.stack.imgur.com/l60Hf.png'}}
          style={styles().image}
        />
      </ImageWrapper>
      <Touchable onPress={() => navigateCallback(userId)}>
        <Wrapper>
          <ContentWrapper>
            <NameText>{userId}</NameText>
            <ContentText>{content}</ContentText>
          </ContentWrapper>
          <DateWrapper>
            <Text>{dateMessageConverter(parseInt(createdAt))}</Text>
          </DateWrapper>
        </Wrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(ChatRoomRow);
