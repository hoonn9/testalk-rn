import React from 'react';
import styled from 'styled-components/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {GestureResponderEvent} from 'react-native';

const Touchable = styled.TouchableOpacity``;

type PackageName = 'Ionicons';

interface IProp {
  packageName?: PackageName;
  name: string;
  size?: number;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

const IconButton: React.FunctionComponent<IProp> = ({
  packageName = 'IonIcon',
  name,
  size = 32,
  onPress,
}) => {
  if (packageName === 'Ionicons') {
    return (
      <Touchable onPress={onPress}>
        <IonIcon name={name} size={size} />
      </Touchable>
    );
  } else {
    return (
      <Touchable onPress={onPress}>
        <IonIcon name={name} size={size} />
      </Touchable>
    );
  }
};

export default IconButton;
