import React, {useState} from 'react';
import styled from 'styled-components/native';
import {dateSimpleConverter, getAge} from '../../utils';

const Container = styled.View``;
const Wrapper = styled.View`
  justify-content: center;
  background-color: #ddd;
  padding: 4px 8px;
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
  background-color: #ddd;
  padding: 0px 8px;
`;
interface ContentProp {
  depth: number;
}
const InfoWrapper = styled.View<ContentProp>`
  padding-left: ${(props: any) => (props.depth === 1 ? '16px' : '0px')};
`;
const Touchable = styled.TouchableOpacity``;
interface TextProp {
  gender: string;
}
const FirstText = styled.Text<TextProp>`
  font-size: 14px;
  color: ${(props: any) => (props.gender === 'male' ? 'blue' : 'red')};
`;
const SecondText = styled.Text`
  font-size: 15px;
`;
const ThirdText = styled.Text`
  font-size: 13px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
interface CommentProp {
  commentActive: boolean;
}
const CommentText = styled.Text<CommentProp>`
  font-size: 13px;
  color: ${(props: any) => (props.commentActive ? 'red' : 'black')};
`;

interface IProp {
  id: number;
  userId: number;
  nickName: string;
  birth: string;
  parentId: number | null;
  depth: number;
  gender: string;
  content: string;
  updatedAt: string;
  deepCommentOnPress: Function;
  deepCommentId: number | undefined;
  nickNameOnPress: Function;
}

const CommentRow: React.FunctionComponent<IProp> = ({
  id,
  userId,
  nickName,
  birth,
  parentId,
  depth,
  gender,
  content,
  updatedAt,
  deepCommentOnPress,
  deepCommentId,
  nickNameOnPress,
}) => {
  return (
    <Container>
      <InfoWrapper depth={depth}>
        <Wrapper>
          <Touchable onPress={() => nickNameOnPress(userId)}>
            <FirstText gender={gender}>{`${nickName}, ${getAge(
              birth,
            )}`}</FirstText>
          </Touchable>
        </Wrapper>
        <Wrapper>
          <SecondText>{content}</SecondText>
        </Wrapper>
        <Wrapper>
          <ThirdText>{dateSimpleConverter(updatedAt)}</ThirdText>
          <Touchable
            onPress={() => {
              deepCommentOnPress(depth === 0 ? id : parentId);
            }}>
            <CommentText
              commentActive={
                deepCommentId && deepCommentId === id ? true : false
              }>
              {'+ 답글'}
            </CommentText>
          </Touchable>
        </Wrapper>
      </InfoWrapper>
    </Container>
  );
};

export default React.memo(CommentRow);
