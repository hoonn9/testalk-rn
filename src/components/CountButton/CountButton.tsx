import React from 'react';
import styled from 'styled-components/native';
import constants from '../../constants';
import {
  ActivityIndicator,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';
import Indicator from '../Indicator';

const Touchable = styled.TouchableOpacity``;

interface IContainer {
  bgColor: string;
}

const Container = styled.View<IContainer>`
  flex-direction: row;
  background-color: ${(props: any) =>
    props.bgColor ? props.bgColor : props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${`${constants.width / 1.7}px`};
`;
const Text = styled.Text`
  color: white;
  font-weight: 400;
`;
const CountText = styled.Text`
  color: white;
  font-weight: 600;
  padding: 0px 8px;
`;

interface IProp extends TouchableOpacityProps {
  text: string;
  count: number;
  bgColor?: any;
  onPress: (event: GestureResponderEvent) => void;
}

const CountButton: React.FC<IProp> = ({
  text,
  count = 0,
  onPress = () => null,
  bgColor = null,
}) => (
  <Touchable activeOpacity={0.8} onPress={onPress}>
    <Container bgColor={bgColor}>
      <Text>{text}</Text>
      <CountText>{count}</CountText>
    </Container>
  </Touchable>
);

export default CountButton;
