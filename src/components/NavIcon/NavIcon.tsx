import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles';

interface IProp {
  packageName?: string;
  focused?: boolean;
  name: string;
  color?: string;
  size?: number;
}

const NavIcon: React.FunctionComponent<IProp> = ({
  packageName = 'Ionicons',
  focused = true,
  name,
  color = styles.blackColor,
  size = 26,
}) => {
  if (packageName === 'Ionicons') {
    return (
      <Ionicons
        name={name}
        color={focused ? color : styles.darkGreyColor}
        size={size}
      />
    );
  } else if (packageName === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={name}
        color={focused ? color : styles.darkGreyColor}
        size={size}
      />
    );
  }
  return null;
};

export default NavIcon;
