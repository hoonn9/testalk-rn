import React, {useState, SetStateAction, Dispatch} from 'react';
import styled from 'styled-components/native';
import constants from '../../constants';
import {
  TouchableOpacityProps,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextInputRow from '../TextInputRow';
import ToogleInput from '../RadioButton';
import AuthButton from '../AuthButton';
const Touchable = styled.TouchableOpacity``;
const TextInput = styled.TextInput``;

interface IContainer {
  bgColor: string;
}

const Container = styled.View`
  background-color: ${(props: any) => props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${`${constants.width}px`};
`;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const RowText = styled.Text``;

interface IProp extends TouchableOpacityProps {
  setTitle: Dispatch<SetStateAction<string>>;
  setContent: Dispatch<SetStateAction<string>>;
}

const PostForm: React.FunctionComponent<IProp> = ({setTitle, setContent}) => {
  return (
    <Container>
      <TextInput
        placeholder="제목을 입력하세요."
        onChangeText={(text: string) => {
          setTitle(text);
        }}
      />
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
