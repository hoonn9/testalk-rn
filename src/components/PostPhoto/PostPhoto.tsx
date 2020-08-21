import React, {useState} from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import constants from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import {PhotoProp} from '../../screens/EditProfile/EditProfile';
import FastImage from 'react-native-fast-image';

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.View`
  width: 100%;
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

const styleSheets = (props: any) =>
  StyleSheet.create({
    image: {
      width: constants.width,
      height: props.height,
    },
  });

interface IProp {
  id: number;
  uri: string;
  photo?: PhotoProp;
  removeOnPress?: (photo: PhotoProp) => void;
}

const PostPhoto: React.FunctionComponent<IProp> = ({
  id,
  uri,
  photo,
  removeOnPress,
}) => {
  const [height, setHeight] = useState<number>(0);
  return (
    <Container>
      <Wrapper>
        <FastImage
          source={{uri: uri}}
          style={styleSheets({height}).image}
          resizeMode="contain"
          onLoad={element => {
            setHeight(
              (element.nativeEvent.height / element.nativeEvent.width) *
                constants.width,
            );
          }}
        />
        {removeOnPress && photo ? (
          <RemoveTouchable onPress={() => removeOnPress(photo)}>
            <Icon name="remove" size={21} color={styles.blackColor} />
          </RemoveTouchable>
        ) : null}
      </Wrapper>
    </Container>
  );
};

export default PostPhoto;
