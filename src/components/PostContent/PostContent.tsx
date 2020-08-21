import React from 'react';
import styled from 'styled-components/native';
import PeoplePhoto from '../PeoplePhoto';
import {dateSimpleConverter, getAge} from '../../utils';
import {SortTarget, GetPost_GetPost_post} from '../../types/api.d';
import PostLikeButton from '../PostLikeButton';
import PostPhoto from '../PostPhoto';
import {ScrollView} from 'react-native-gesture-handler';

const Container = styled.View`
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const Wrapper = styled.View`
  flex: 1;
  padding: 0px 8px;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;
const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
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
const DateWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 8px;
`;
const ContentWrapper = styled.View`
  flex-direction: column;
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
  width: 100%;
  font-size: 16px;
  color: ${(props: any) => props.theme.blackColor};
  padding: 8px;
  margin: 8px;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const DateText = styled.Text`
  width: 100%;
  text-align: right;
`;
interface TextProp {
  gender: string;
}
const PeopleText = styled.Text<TextProp>`
  flex: 1;
  font-size: 15px;
  color: ${(props: any) => (props.gender === 'male' ? 'blue' : 'red')};
  padding: 0px 8px;
`;
const Text = styled.Text``;
const CommentToggleWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-self: flex-end;
`;
const PostLikeTouchable = styled.TouchableOpacity`
  padding: 8px;
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
  postData: GetPost_GetPost_post;
  commentSort: SortTarget;
  setCommentSort: Function;
  postPhotoOnPress: Function;
  isLiked: boolean;
}

const PostContent: React.FunctionComponent<IProp> = ({
  postData,
  commentSort,
  setCommentSort,
  postPhotoOnPress,
  isLiked,
}) => {
  const {
    id,
    title,
    content,
    likeCount,
    createdAt,
    files,
    user: {id: userId, birth, nickName, gender, profilePhoto},
  } = postData;
  return (
    <Container>
      <TitleWrapper>
        <TitleText>
          {title}dddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </TitleText>
      </TitleWrapper>
      <PeopleWrapper>
        <Touchable onPress={() => postPhotoOnPress(userId)}>
          <PeoplePhoto
            gender={gender}
            uri={
              profilePhoto && profilePhoto.length > 0
                ? profilePhoto[0].url
                : undefined
            }
            size={50}
          />
        </Touchable>
        <PeopleText gender={gender}>{`${nickName}, ${getAge(
          birth,
        )} `}</PeopleText>
      </PeopleWrapper>
      <DateWrapper>
        <DateText>{dateSimpleConverter(createdAt)}</DateText>
      </DateWrapper>
      <ContentWrapper>
        {files &&
          files.length > 0 &&
          files.map((e, i) => <PostPhoto key={i} id={e.id} uri={e.url} />)}
        <ContentText>{content}</ContentText>
      </ContentWrapper>
      <RowWrapper>
        <PostLikeButton id={id} isLiked={isLiked} likeCount={likeCount} />
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
      </RowWrapper>
    </Container>
  );
};

export default PostContent;
