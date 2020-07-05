import React from "react";
import styled from "styled-components/native";
import { SendChatMessage_SendChatMessage_message } from "../../types/api";
import { GestureResponderEvent } from "react-native";

const Container = styled.View`
  flex: 1;
`;
const Touchable = styled.TouchableOpacity`
  height: 50px;
`;
const Wrapper = styled.View`
  flex-direction: row;
`;
const Text = styled.Text``;

interface IProp {
  id: number;
  userId: number;
  chatId: number;
  content: string;
  createdAt: string;
  requestTime: string;
  navigateCallback: (
    id: number,
    userId: number,
    requestTime: string
  ) => void | undefined;
}

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
      <Touchable onPress={() => navigateCallback(chatId, userId, requestTime)}>
        <Wrapper>
          <Text>
            {chatId}
            {userId}
          </Text>
          <Text></Text>
        </Wrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(ChatRoomRow);
