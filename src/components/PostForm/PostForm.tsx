import React, {useState, SetStateAction, Dispatch} from 'react';
import styled from 'styled-components/native';
import constants from '../../constants';
import {
  TouchableOpacityProps,
  Platform,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInputRow from '../TextInputRow';
import ToogleInput from '../RadioButton';
import AuthButton from '../AuthButton';
import FloatButton from '../FloatButton';
import {PhotoProp} from '../../screens/Profile/EditProfile/EditProfile';
import FastImage from 'react-native-fast-image';
import PostPhoto from '../PostPhoto';
const Touchable = styled.TouchableOpacity``;
const TextInput = styled.TextInput``;

interface IContainer {
  bgColor: string;
}

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.whiteColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${`${constants.width}px`};
  height: 100%;
`;
const Wrapper = styled.View``;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const RowText = styled.Text``;

const styleSheets = StyleSheet.create({
  image: {
    width: '100%',
    height: '125px',
  },
});

interface IProp extends TouchableOpacityProps {
  photoList: Array<PhotoProp>;
  setTitle: Dispatch<SetStateAction<string>>;
  setContent: Dispatch<SetStateAction<string>>;
  photoRemoveOnPress: (photo: PhotoProp) => void;
}

const PostForm: React.FunctionComponent<IProp> = ({
  photoList,
  setTitle,
  setContent,
  photoRemoveOnPress,
}) => {
  console.log(photoList);
  return (
    <Container>
      <TextInput
        placeholder="제목을 입력하세요."
        onChangeText={(text: string) => {
          setTitle(text);
        }}
      />
      <Wrapper>
        {photoList &&
          photoList.length > 0 &&
          photoList.map((e, i) => {
            return (
              <PostPhoto
                key={i}
                id={e.id}
                uri={e.uri}
                photo={e}
                removeOnPress={photoRemoveOnPress}
              />
            );
          })}
      </Wrapper>
      <TextInput
        placeholder="내용을 입력하세요."
        multiline
        onChangeText={(text: string) => {
          setContent(text);
        }}
      />
    </Container>
  );
};

export default PostForm;
