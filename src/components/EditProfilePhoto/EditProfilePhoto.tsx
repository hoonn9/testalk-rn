import React from 'react';
import styled from 'styled-components/native';
import {Image, StyleSheet} from 'react-native';
import constants from '../../constants';

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
const Text = styled.Text``;

const styles = StyleSheet.create({
  image: {
    width: 125,
    height: 125,
  },
});

interface IProp {
  url: string;
}

const EditProfilePhoto: React.FunctionComponent<IProp> = ({url}) => {
  return (
    <Container>
      <Touchable>
        <Image source={{uri: url}} style={styles.image} />
      </Touchable>
    </Container>
  );
};

export default EditProfilePhoto;
