import React from 'react';
import styled from 'styled-components/native';
import {GestureResponderEvent} from 'react-native';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${(props: any) => props.theme.whiteColor};
  border: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const Text = styled.Text`
  color: ${(props: any) => props.theme.blackColor};
`;
const Touchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 8px;
`;
const TextInput = styled.TextInput`
  flex: 1;
  padding: 8px;
`;

const DeepCommentTouchable = styled.TouchableOpacity`
  border: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};

  margin: 4px;
  border-radius: 12px;
  justify-content: center;
  padding: 8px;
`;

interface IProp {
  comment: string;
  deepCommentId: number | undefined;
  onCommentChange: ((text: string) => void) | undefined;
  deepCommentOnPress: ((event: GestureResponderEvent) => void) | undefined;
  commentRegOnPress: ((event: GestureResponderEvent) => void) | undefined;
}

const CommentInput: React.FunctionComponent<IProp> = ({
  comment,
  deepCommentId,
  onCommentChange,
  deepCommentOnPress,
  commentRegOnPress,
}) => {
  return (
    <Container>
      {deepCommentId ? (
        <DeepCommentTouchable onPress={deepCommentOnPress} activeOpacity={0.8}>
          <Text>답글 x</Text>
        </DeepCommentTouchable>
      ) : null}
      <TextInput value={comment} onChangeText={onCommentChange} />
      <Touchable onPress={commentRegOnPress}>
        <Text>등록</Text>
      </Touchable>
    </Container>
  );
};

export default CommentInput;
