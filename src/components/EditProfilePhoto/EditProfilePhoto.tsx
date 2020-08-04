import React from 'react';
import styled from 'styled-components/native';
import {Image, StyleSheet, GestureResponderEvent} from 'react-native';
import constants from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import {PhotoProp} from '../../screens/EditProfile/EditProfile';

const Container = styled.View`
  width: ${`${constants.width / 3}px`};
  height: 150px;
  justify-content: center;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity`
  width: 90%;
  height: 90%;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme.whiteColor};
  border-radius: 12px;
`;
const RemoveTouchable = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: ${(props: any) => props.theme.lightGreyColor};
`;
const Text = styled.Text``;

const styleSheets = StyleSheet.create({
  image: {
    width: 125,
    height: 125,
  },
});

interface IProp {
  photo: PhotoProp;
  removeOnPress: (photo: PhotoProp) => void;
}

const EditProfilePhoto: React.FunctionComponent<IProp> = ({
  photo,
  removeOnPress,
}) => {
  return (
    <Container>
      <Touchable>
        <Image source={{uri: photo.uri}} style={styleSheets.image} />
        <RemoveTouchable onPress={() => removeOnPress(photo)}>
          <Icon name="remove" size={21} color={styles.blackColor} />
        </RemoveTouchable>
      </Touchable>
    </Container>
  );
};

export default EditProfilePhoto;
