import React from 'react';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles';
import {GestureResponderEvent, TextInputProps} from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.lightGreyColor};
`;
const Wrapper = styled.View`
  flex-direction: row;
  flex: 1;
`;
const Text = styled.Text``;
const TextInput = styled.TextInput`
  flex: 1;
  height: 50px;
  padding: 0px 12px;
`;
const SendButton = styled.TouchableOpacity`
  justify-content: center;
`;

interface IProp extends TextInputProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

const SendMessage: React.FunctionComponent<IProp> = ({
  onPress,
  value,
  onChangeText,
}) => {
  return (
    <Container>
      <Wrapper>
        <TextInput value={value} onChangeText={onChangeText} />
        <SendButton onPress={onPress}>
          <MaterialCommunityIcons
            name="send"
            color={styles.blackColor}
            size={26}
          />
        </SendButton>
      </Wrapper>
    </Container>
  );
};

export default SendMessage;
