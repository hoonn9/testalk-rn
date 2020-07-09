import React from 'react';
import styled from 'styled-components/native';
import {Image, StyleSheet} from 'react-native';
import {TouchableOpacityProps} from 'react-native';
import constants from '../../constants';
import {getAge} from '../../utils';

const Container = styled.View`
  width: ${`${constants.width / 1.05}px`};
  background-color: #ddd;
`;
const Wrapper = styled.View``;
const Touchable = styled.TouchableOpacity`
  width: 125px;
  height: 125px;
`;
const Text = styled.Text``;

const InfoContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const ImageWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const InfoWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  padding-top: 10px;
`;

const GenderWrapper = styled.View`
  align-items: center;
`;

const NameText = styled.Text`
  font-size: 26px;
  padding: 0px 5px;
  font-weight: 700;
`;

const AgeText = styled.Text`
  font-size: 21px;
  padding: 0px 5px;
`;
const GenderText = styled.Text`
  font-size: 24px;
`;

const styles = StyleSheet.create({
  image: {
    width: 125,
    height: 125,
    borderRadius: 125 / 2,
  },
});

interface IProp extends TouchableOpacityProps {
  nickName: string;
  birth: string;
  gender: string;
}

const MyProfile: React.FunctionComponent<IProp> = ({
  nickName,
  birth,
  gender,
}) => {
  const maxNameLength = 16;
  const nick = nickName;
  return (
    <Container>
      <Wrapper>
        <InfoContainer>
          <ImageWrapper>
            <Touchable>
              <Image
                source={{uri: 'https://i.stack.imgur.com/l60Hf.png'}}
                style={styles.image}
              />
            </Touchable>
          </ImageWrapper>
          <InfoWrapper>
            <NameText numberOfLines={1}>
              {nick.length > maxNameLength
                ? nick.substring(0, maxNameLength - 3) + '...'
                : nickName}
            </NameText>
            <AgeText>{getAge(birth)}</AgeText>
            <GenderText>{gender === 'female' ? '♀' : '♂'}</GenderText>
          </InfoWrapper>
          <GenderWrapper />
        </InfoContainer>
      </Wrapper>
    </Container>
  );
};

export default MyProfile;
