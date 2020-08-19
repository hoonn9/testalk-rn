import React from 'react';
import styled from 'styled-components/native';
import PeoplePhoto from '../PeoplePhoto';
import {dateSimpleConverter} from '../../utils';
import {SortTarget} from '../../types/api.d';

const Container = styled.View`
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const Wrapper = styled.View`
  padding: 0px 8px;
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 8px;
`;
const PeopleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 8px;
`;
const ContentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const Touchable = styled.TouchableOpacity``;
const TitleText = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${(props: any) => props.theme.blackColor};
  padding: 8px;
`;
const ContentText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${(props: any) => props.theme.blackColor};
  padding: 8px;
  margin: 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
interface TextProp {
  gender: string;
}
const PeopleText = styled.Text<TextProp>`
  flex: 1;
  font-size: 15px;
  color: ${(props: any) => (props.gender === 'male' ? 'blue' : 'red')};
`;
const Text = styled.Text``;
const CommentToggleWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;
const CommentTouchable = styled.TouchableOpacity`
  padding: 8px;
`;
const CommentSelectedText = styled.Text`
  color: ${(props: any) => props.theme.blackColor};
`;
const CommentUnSelectedText = styled.Text`
  color: ${(props: any) => props.theme.darkGreyColor};
`;
interface IProp {
  id: number;
  userId: number;
  gender: string;
  title: string;
  content: string;
  updatedAt: string;
  commentSort: SortTarget;
  setCommentSort: Function;
}

const PostContent: React.FunctionComponent<IProp> = ({
  id,
  userId,
  gender,
  title,
  content,
  updatedAt,
  commentSort,
  setCommentSort,
}) => {
  return (
    <Container>
      <TitleWrapper>
        <TitleText>
          {title}dddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </TitleText>
      </TitleWrapper>
      <PeopleWrapper>
        <PeoplePhoto gender={gender} size={50} />
        <Wrapper>
          <PeopleText gender={gender}>글쓴이</PeopleText>
          <Text>{dateSimpleConverter(updatedAt)}</Text>
        </Wrapper>
      </PeopleWrapper>
      <ContentWrapper>
        <ContentText>{content}</ContentText>
      </ContentWrapper>
      <CommentToggleWrapper>
        <CommentTouchable
          activeOpacity={1}
          onPress={() => setCommentSort(SortTarget.DESC)}>
          {commentSort === SortTarget.DESC ? (
            <CommentSelectedText>최신순</CommentSelectedText>
          ) : (
            <CommentUnSelectedText>최신순</CommentUnSelectedText>
          )}
        </CommentTouchable>
        <CommentTouchable
          activeOpacity={1}
          onPress={() => setCommentSort(SortTarget.ASC)}>
          {commentSort === SortTarget.ASC ? (
            <CommentSelectedText>오래된순</CommentSelectedText>
          ) : (
            <CommentUnSelectedText>오래된순</CommentUnSelectedText>
          )}
        </CommentTouchable>
      </CommentToggleWrapper>
    </Container>
  );
};

export default PostContent;
