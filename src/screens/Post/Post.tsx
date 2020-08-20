import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {useLazyQuery} from '@apollo/react-hooks';
import {
  GetPostList,
  GetPostListVariables,
  GetPostList_GetPostList_posts,
} from '../../types/api';
import {GET_POST_LIST} from './Post.queries';
import {toast} from '../../tools';
import {FlatList, RefreshControl} from 'react-native';
import PostRow from '../../components/PostRow';
import {FirstElementFromId} from '../../utils';
import RowSeparator from '../../components/RowSeparator';
import FloatButton from '../../components/FloatButton';

const View = styled.View``;
const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;
const Container = styled.View`
  flex: 1;
`;
const FloatButtonWrapper = styled.View`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text``;

interface IProp {}
const POST_LIMIT = 10;
const Post: React.FunctionComponent<IProp> = ({}) => {
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [postList, setPostList] = useState<
    Array<GetPostList_GetPostList_posts>
  >([]);
  const [updateTime, setUpdateTime] = useState<string>(Date.now().toString());
  const [skip, setSkip] = useState<number>(0);

  const [getPostList] = useLazyQuery<GetPostList, GetPostListVariables>(
    GET_POST_LIST,
    {
      variables: {
        means: '',
        requestTime: updateTime,
        skip,
        take: POST_LIMIT,
      },
      onCompleted: data => {
        console.log(data);
        if (data) {
          setIsRefreshing(false);

          if (data.GetPostList.posts) {
            const posts: GetPostList_GetPostList_posts[] = [];
            data.GetPostList.posts.forEach(e => {
              if (e) {
                posts.push(e);
              }
            });
            setPostList([...postList, ...posts]);
          }
        }
      },
      onError: () => {
        setIsRefreshing(false);
        toast('리스트를 불러올 수 없어요!');
      },
    },
  );

  const onRefresh = () => {
    setUpdateTime(Date.now().toString());
    setSkip(0);
    setPostList([]);
  };

  const onEndReached = () => {
    setSkip(skip + POST_LIMIT);
  };

  const onSelected = (post: GetPostList_GetPostList_posts) => {
    navigation.navigate('ReadPostNavigation', {post});
  };

  const imageOnPress = (id: number) => {
    navigation.navigate('Profile', {userId: id});
  };

  useEffect(() => {
    getPostList();
  }, []);

  return (
    <>
      <Container>
        <SafeAreaView>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(e, i) => i.toString()}
            windowSize={5}
            data={postList}
            renderItem={({item}) => {
              const {
                id: userId,
                nickName,
                gender,
                birth,
                profilePhoto,
              } = item.user;
              return (
                <PostRow
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  userId={userId}
                  nickName={nickName}
                  gender={gender}
                  birth={birth}
                  profilePhoto={
                    profilePhoto && profilePhoto.length > 0
                      ? FirstElementFromId(profilePhoto).url
                      : 'https://i.stack.imgur.com/l60Hf.png'
                  }
                  updatedAt={item.updatedAt}
                  onSelected={() => onSelected(item)}
                  imageOnPress={() => imageOnPress(userId)}
                />
              );
            }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.01}
          />
        </SafeAreaView>
        <FloatButtonWrapper>
          <FloatButton
            onPress={() => navigation.navigate('UploadPostNavigation')}
          />
        </FloatButtonWrapper>
      </Container>
    </>
  );
};

export default Post;
