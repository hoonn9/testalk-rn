import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import styled from 'styled-components/native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import PostForm from '../../components/PostForm';
import {useMutation} from '@apollo/react-hooks';
import {UPLOAD_POST} from './Post.queries';
import {
  UploadPost as UploadPostApi,
  UploadPostVariables,
} from '../../types/api';
import {toast} from '../../tools';

const View = styled.View``;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  flex-direction: row;
  background-color: #ddd;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text``;
const ScrollView = styled.ScrollView``;

interface IProp {}

const UploadPost: React.FunctionComponent<IProp> = ({}) => {
  const navigation = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [UploadPostMutation] = useMutation<UploadPostApi, UploadPostVariables>(
    UPLOAD_POST,
    {
      variables: {
        title: title,
        content: content,
      },
    },
  );

  const ConfirmOnPress = async () => {
    try {
      const {data} = await UploadPostMutation();
      if (data && data.UploadPost && data.UploadPost.ok) {
        toast('업로드 완료');
      } else {
        toast('업로드 실패');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable onPress={() => ConfirmOnPress()}>
          <Text>완료</Text>
        </Touchable>
      ),
    });
  }, [content]);

  return (
    <>
      <ScrollView>
        <Container>
          <Wrapper>
            <PostForm setTitle={setTitle} setContent={setContent} />
          </Wrapper>
        </Container>
      </ScrollView>
    </>
  );
};

export default UploadPost;
