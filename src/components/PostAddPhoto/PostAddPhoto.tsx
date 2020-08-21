import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Fontisto';
import constants from '../../constants';
import styles from '../../styles';

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

interface IProp {
  onPress: () => void;
}

const PostAddPhoto: React.FunctionComponent<IProp> = ({onPress}) => {
  return (
    <Container>
      <Touchable onPress={onPress}>
        <Icon name="plus-a" size={31} color={styles.blackColor} />
      </Touchable>
    </Container>
  );
};

export default PostAddPhoto;
