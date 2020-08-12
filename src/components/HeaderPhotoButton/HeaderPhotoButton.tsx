import React from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text`
  font-size: 16px;
  margin-left: 8px;
`;
interface StyleSheetProp {
  height: number;
}

const styleSheets = (props: StyleSheetProp) =>
  StyleSheet.create({
    image: {
      width: props.height - 8,
      height: props.height - 8,
      borderRadius: props.height / 2,
      borderWidth: 0,
    },
  });

interface IProp {
  uri: string | undefined;
  gender: string;
  headerHeight: number;
  nickName: string;
  imageOnPress: Function;
}

const HeaderImageButton: React.FunctionComponent<IProp> = ({
  uri,
  gender,
  headerHeight,
  nickName,
  imageOnPress,
}) => {
  return (
    <Wrapper>
      <Touchable onPress={() => imageOnPress()}>
        {uri ? (
          <FastImage
            source={{uri}}
            style={styleSheets({height: headerHeight}).image}
          />
        ) : gender === 'male' ? (
          <FastImage
            source={require('../../../images/male.png')}
            style={styleSheets({height: headerHeight}).image}
          />
        ) : (
          <FastImage
            source={require('../../../images/female.png')}
            style={styleSheets({height: headerHeight}).image}
          />
        )}
      </Touchable>
      <Text>{nickName}</Text>
    </Wrapper>
  );
};

export default HeaderImageButton;
