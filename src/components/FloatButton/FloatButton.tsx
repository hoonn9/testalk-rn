import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from '../../constants';
import {numberWithCommas} from '../../utils';
import {GestureResponderEvent} from 'react-native';

const Text = styled.Text`
  font-size: 18px;
`;
const View = styled.View``;
const Touchable = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: ${`${80 / 2}px`};
  border-radius: 100px;
  background-color: ${(props: any) => props.theme.darkGreyColor};
  justify-content: center;
  align-items: center;
`;

interface IProp {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

const FloatButton: React.FunctionComponent<IProp> = ({onPress}) => {
  return (
    <Touchable activeOpacity={0.7} onPress={onPress}>
      <Icon name="pencil" size={33} />
    </Touchable>
  );
};

export default FloatButton;
