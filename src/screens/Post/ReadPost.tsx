import React, {useLayoutEffect, useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {useMutation, useQuery, useLazyQuery} from '@apollo/react-hooks';
import {ADD_COMMENT, GET_POST} from './Post.queries';
import {
  GetPostList_GetPostList_posts,
  AddComment,
  AddCommentVariables,
  GetPost,
  GetPostVariables,
  GetPost_GetPost_post_comments,
  GetPost_GetPost_post,
} from '../../types/api';
import {toast} from '../../tools';
import CommentInput from '../../components/CommentInput';
import {FlatList} from 'react-native-gesture-handler';
import CommentRow from '../../components/CommentRow';
import RowSeparator from '../../components/RowSeparator';
import PostContent from '../../components/PostContent';
import Indicator from '../../components/Indicator';

const View = styled.View``;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text``;

const ScrollView = styled.ScrollView`
  flex: 1;
`;
const CommentInputWrapper = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
`;

type ReadPostRouteProp = {
  ReadPost: {
    post: GetPostList_GetPostList_posts;
  };
};

interface IProp {
  route: ReadPostRoute;
}

type ReadPostRoute = RouteProp<ReadPostRouteProp, 'ReadPost'>;

const ReadPost: React.FunctionComponent<IProp> = ({route}) => {
  const navigation = useNavigation();
  const {
    post: {id, title, content},
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerMode: 'screen',
      headerRight: () => (
        <Touchable onPress={() => null}>
          <Text>완료</Text>
        </Touchable>
      ),
    });
  }, [content]);

  const [comment, setComment] = useState<string>('');
  const [postData, setPostData] = useState<GetPost_GetPost_post>();
  const [commentList, setCommentList] = useState<
    Array<GetPost_GetPost_post_comments>
  >([]);
  const [getPost] = useLazyQuery<GetPost, GetPostVariables>(GET_POST, {
    variables: {
      id: id,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      if (data) {
        if (data.GetPost.post) {
          setPostData(data.GetPost.post);
          if (data.GetPost.post.comments) {
            setCommentList([...commentList, ...data.GetPost.post.comments]);
          }
        }
      }
    },
  });

  const [AddCommentMutation] = useMutation<AddComment, AddCommentVariables>(
    ADD_COMMENT,
  );

  useEffect(() => {
    getPost();
  }, []);

  const commentRegOnPress = async () => {
    try {
      const {data} = await AddCommentMutation({
        variables: {postId: id, content: comment},
      });

      if (data && data.AddComment && data.AddComment.ok) {
        setComment('');
      } else {
        toast('댓글을 다는 중 문제가 생겼어요.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={
          postData ? (
            <PostContent
              id={postData.id}
              userId={postData.user.id}
              gender={postData.user.gender}
              title={title}
              content={content}
              updatedAt={
                postData.updatedAt ? postData.updatedAt : postData.createdAt
              }
            />
          ) : (
            <Indicator showing={true} />
          )
        }
        stickyHeaderIndices={[0]}
        keyExtractor={(e, i) => i.toString()}
        windowSize={10}
        data={commentList}
        renderItem={({item}) => {
          const {id, content, updatedAt, createdAt} = item;
          return (
            <CommentRow
              id={id}
              userId={item.user.id}
              gender={item.user.gender}
              content={content}
              updatedAt={updatedAt ? updatedAt : createdAt}
            />
          );
        }}
        ItemSeparatorComponent={() => <RowSeparator />}
      />
      <CommentInputWrapper>
        <CommentInput
          comment={comment}
          onCommentChange={(text: string) => setComment(text)}
          commentRegOnPress={() => commentRegOnPress()}
        />
      </CommentInputWrapper>
    </>
  );
};

export default ReadPost;
