import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet, TouchableOpacityProps} from 'react-native';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import constants from '../../constants';
import {getAge} from '../../utils';
import styles from '../../styles';
import UserLikeButton from '../UserLikeButton';
const View = styled.View``;
const Container = styled.View`
  flex: 1;
  height: 100%;
  background-color: #ddd;
`;
const Wrapper = styled.View`
  flex: 1;
`;
const Touchable = styled.TouchableOpacity`
  flex: 1;
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
  height: 300px;
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

const styleSheets = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

interface IProp extends TouchableOpacityProps {
  id: number;
  nickName: string;
  birth: string;
  gender: string;
  profilePhoto: Array<string>;
  ImageOnPress: (url: string) => void;
  likeCount: number;
  isLiked: boolean;
}

const Dot: React.FunctionComponent = () => {
  return (
    <View
      style={{
        backgroundColor: styles.greyColor,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
};

const ActiveDot: React.FunctionComponent = () => {
  return (
    <View
      style={{
        backgroundColor: styles.darkBlueColor,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
};

const Profile: React.FunctionComponent<IProp> = ({
  id,
  nickName,
  birth,
  gender,
  profilePhoto,
  ImageOnPress,
  likeCount,
  isLiked,
}) => {
  const maxNameLength = 16;
  const nick = nickName;

  return (
    <Container>
      <Wrapper>
        <InfoContainer>
          <Swiper
            style={{height: constants.height / 2.75, backgroundColor: '#000'}}
            dot={<Dot />}
            activeDot={<ActiveDot />}>
            {profilePhoto.map((e, i) => (
              <Touchable
                activeOpacity={1}
                key={i}
                onPress={() => ImageOnPress(e)}>
                <FastImage
                  style={styleSheets.image}
                  source={{uri: e}}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </Touchable>
            ))}
          </Swiper>
          <InfoWrapper>
            <NameText numberOfLines={1}>
              {nick.length > maxNameLength
                ? nick.substring(0, maxNameLength - 3) + '...'
                : nickName}
            </NameText>
            <AgeText>{getAge(birth)}</AgeText>
            <GenderText>{gender === 'female' ? '♀' : '♂'}</GenderText>
          </InfoWrapper>
          <InfoWrapper>
            <UserLikeButton id={id} isLiked={isLiked} likeCount={likeCount} />
          </InfoWrapper>
          <GenderWrapper />
        </InfoContainer>
      </Wrapper>
    </Container>
  );
};

export default Profile;
