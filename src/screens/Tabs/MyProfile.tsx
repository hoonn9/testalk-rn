import React, {useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/react-hooks';
import {GET_MY_PROFILE} from './MyProfile.queries';
import {GetMyProfile, GetMyProfile_GetMyProfile} from '../../types/api';
import withSuspense from '../../withSuspense';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import constants from '../../constants';
import {getAge} from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import Indicator from '../../components/Indicator';
import EmptyScreen from '../../components/EmptyScreen';
import IconButton from '../../components/IconButton';
import CountButton from '../../components/CountButton';

const View = styled.View``;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  width: ${`${constants.width / 1.05}px`};
  background-color: #ddd;
`;
const ImageTouchable = styled.TouchableOpacity`
  width: 125px;
  height: 125px;
`;
const EditTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-content: center;
  margin: 8px;
  width: 35px;
  height: 35px;
`;
const Touchable = styled.TouchableOpacity``;
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

const BottomWrapper = styled.View`
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

const headerButtonStyle = {
  marginEnd: 16,
};

interface IProp {}

const Profile: React.FunctionComponent<IProp> = () => {
  const maxNameLength = 16;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={headerButtonStyle}>
          <IconButton
            packageName="Ionicons"
            name="settings"
            onPress={() => navigation.navigate('SettingNavigation')}
            size={22}
          />
        </View>
      ),
    });
  }, [navigation]);

  const {loading, error, refetch, data} = useQuery<
    GetMyProfile,
    GetMyProfile_GetMyProfile
  >(GET_MY_PROFILE, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('MyProfile onFocus');
      refetch();
    });
    return unsubscribe;
  }, []);

  const ImageOnPress = (id: number) => {
    navigation.navigate('Profile', {userId: id});
  };

  const editOnPress = () => {
    if (
      data &&
      data.GetMyProfile &&
      data.GetMyProfile.ok &&
      data.GetMyProfile.user
    ) {
      navigation.navigate('EditProfileNavigation', {
        user: data.GetMyProfile.user,
      });
    }
  };

  if (
    data &&
    data.GetMyProfile &&
    data.GetMyProfile.ok &&
    data.GetMyProfile.user
  ) {
    const {
      user: {id, nickName, gender, birth, profilePhoto, cash},
      likeCount,
    } = data.GetMyProfile;
    console.log(data.GetMyProfile.user);
    return (
      <ScrollView>
        <Container>
          <Wrapper>
            <InfoContainer>
              <ImageWrapper>
                <ImageTouchable
                  activeOpacity={0.8}
                  onPress={() => ImageOnPress(id)}>
                  <FastImage
                    source={{
                      uri:
                        profilePhoto && profilePhoto.length > 0
                          ? profilePhoto[0].url
                          : 'https://i.stack.imgur.com/l60Hf.png',
                    }}
                    style={styles.image}
                  />
                </ImageTouchable>
              </ImageWrapper>
              <InfoWrapper>
                <NameText numberOfLines={1}>
                  {nickName.length > maxNameLength
                    ? nickName.substring(0, maxNameLength - 3) + '...'
                    : nickName}
                </NameText>
                <AgeText>{getAge(birth)}</AgeText>
                <GenderText>{gender === 'female' ? '♀' : '♂'}</GenderText>
              </InfoWrapper>
              <BottomWrapper>
                <EditTouchable activeOpacity={0.8} onPress={editOnPress}>
                  <Icon name="form" size={26} />
                </EditTouchable>

                {likeCount ? (
                  <CountButton
                    count={likeCount}
                    text="나의 좋아요"
                    onPress={() => navigation.navigate('CheckLike')}
                  />
                ) : null}

                <Text>{cash}</Text>
                <Touchable onPress={() => navigation.navigate('Purchase')}>
                  <Text>캐시 구매하기</Text>
                </Touchable>
              </BottomWrapper>
            </InfoContainer>
          </Wrapper>
        </Container>
      </ScrollView>
    );
  } else {
    return <EmptyScreen text={'네트워크 연결이 필요해요.'} />;
  }
};

export default withSuspense(Profile);
