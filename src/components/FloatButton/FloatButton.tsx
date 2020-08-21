import React, {ElementType, ReactElement, Component} from 'react';
import styled from 'styled-components/native';
import constants from '../../constants';
import {numberWithCommas} from '../../utils';
import {GestureResponderEvent} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';

const Text = styled.Text`
  font-size: 18px;
`;
const View = styled.View``;
interface TouchableProp {
  size: number;
}
const Touchable = styled.TouchableOpacity<TouchableProp>`
  width: ${(props: any) => `${props.size}px`};
  height: ${(props: any) => `${props.size}px`};
  border-radius: ${`${80 / 2}px`};
  border-radius: 100px;
  background-color: ${(props: any) => props.theme.darkGreyColor};
  justify-content: center;
  align-items: center;
`;

interface IProp {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  size?: number;
  icon: any;
}

const FloatButton: React.FunctionComponent<IProp> = ({
  onPress,
  size = 80,
  icon,
}) => {
  return (
    <Touchable size={size} activeOpacity={0.7} onPress={onPress}>
      {icon}
    </Touchable>
  );
};

export default FloatButton;
