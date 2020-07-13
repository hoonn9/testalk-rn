import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Container = styled.View`
  margin-right: 14px;
  justify-content: center;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;

interface IProp {}

const ChatLink: React.FunctionComponent<IProp> = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <Touchable onPress={() => navigation.navigate('Chat')}>
        <Icon name="chat-processing" size={28} color="black" />
      </Touchable>
    </Container>
  );
};

export default ChatLink;
