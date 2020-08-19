import React, {
  useLayoutEffect,
  useState,
  useEffect,
  createRef,
  useRef,
} from 'react';
import styled from 'styled-components/native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {ADD_COMMENT, GET_POST, GET_COMMENT_LIST} from './Post.queries';
import {
  GetPostList_GetPostList_posts,
  AddComment,
  AddCommentVariables,
  GetPost,
  GetPostVariables,
  GetPost_GetPost_post,
  GetCommentList,
  GetCommentListVariables,
  GetCommentList_GetCommentList_comments,
  SortTarget,
} from '../../types/api.d';
import {toast} from '../../tools';
import CommentInput from '../../components/CommentInput';
import {FlatList} from 'react-native-gesture-handler';
import CommentRow from '../../components/CommentRow';
import RowSeparator from '../../components/RowSeparator';
import PostContent from '../../components/PostContent';
import Indicator from '../../components/Indicator';
import styles from '../../styles';
import {View as ViewProp} from 'react-native';

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

  const [inputHeight, setInputHeight] = useState<number>();

  const [commentSort, setCommentSort] = useState<SortTarget>(SortTarget.ASC);
  const [comment, setComment] = useState<string>('');
  const [postData, setPostData] = useState<GetPost_GetPost_post>();
  const [commentList, setCommentList] = useState<
    Array<GetCommentList_GetCommentList_comments>
  >([]);

  const [deepCommentId, setDeepCommentId] = useState<number>();

  const [getPost] = useLazyQuery<GetPost, GetPostVariables>(GET_POST, {
    variables: {
      id: id,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      if (data) {
        if (data.GetPost.post) {
          setPostData(data.GetPost.post);
        }
      }
    },
  });

  const COMMENT_LIMIT = 10;
  const [skip, setSkip] = useState<number>(0);

  const [getCommentList] = useLazyQuery<
    GetCommentList,
    GetCommentListVariables
  >(GET_COMMENT_LIST, {
    variables: {
      id: id,
      skip: skip,
      take: COMMENT_LIMIT,
      sort: commentSort,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      if (data) {
        if (data.GetCommentList.comments) {
          const commentArray: GetCommentList_GetCommentList_comments[] = [];
          data.GetCommentList.comments.forEach(e => {
            if (e) {
              commentArray.push(e);
            }
          });
          setCommentList([...commentList, ...commentArray]);
        }
      }
    },
  });

  useEffect(() => {
    setCommentList([]);
    setSkip(0);
    setDeepCommentId(undefined);
  }, [commentSort]);

  const [addCommentMutation] = useMutation<AddComment, AddCommentVariables>(
    ADD_COMMENT,
  );

  const onEndReached = () => {
    setSkip(skip + COMMENT_LIMIT);
  };

  const commentRegOnPress = async () => {
    try {
      if (deepCommentId) {
        const {data} = await addCommentMutation({
          variables: {postId: id, parentId: deepCommentId, content: comment},
        });

        if (data && data.AddComment && data.AddComment.ok) {
          setComment('');
          setCommentList([]);
          setSkip(0);
          setDeepCommentId(undefined);
        } else {
          toast('댓글을 다는 중 문제가 생겼어요.');
        }
      } else {
        const {data} = await addCommentMutation({
          variables: {postId: id, content: comment},
        });

        if (data && data.AddComment && data.AddComment.ok) {
          setComment('');
          setCommentList([]);
          setSkip(0);
          setDeepCommentId(undefined);
        } else {
          toast('댓글을 다는 중 문제가 생겼어요.');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deepCommentOnPress = (id: number) => {
    setDeepCommentId(id);
  };

  useEffect(() => {
    getPost();
    getCommentList();
  }, []);

  return (
    <>
      <FlatList
        style={{
          backgroundColor: `${styles.whiteColor}`,
        }}
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
              commentSort={commentSort}
              setCommentSort={setCommentSort}
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
              parentId={item.parentId}
              depth={item.depth}
              gender={item.user.gender}
              content={content}
              updatedAt={updatedAt ? updatedAt : createdAt}
              deepCommentOnPress={deepCommentOnPress}
              deepCommentId={deepCommentId}
            />
          );
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        ItemSeparatorComponent={() => <RowSeparator />}
        ListFooterComponent={<View style={{height: inputHeight}} />}
      />
      {commentList.length === 0 ? <Indicator showing={true} /> : null}
      <CommentInputWrapper
        onLayout={event => {
          setInputHeight(event.nativeEvent.layout.height);
        }}>
        <CommentInput
          comment={comment}
          deepCommentId={deepCommentId}
          onCommentChange={(text: string) => setComment(text)}
          commentRegOnPress={commentRegOnPress}
          deepCommentOnPress={() => setDeepCommentId(undefined)}
        />
      </CommentInputWrapper>
    </>
  );
};

export default ReadPost;
