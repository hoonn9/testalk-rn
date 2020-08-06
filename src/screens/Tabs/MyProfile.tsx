import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/react-hooks';
import {GET_MY_PROFILE} from './MyProfile.queries';
import {GetMyProfile, GetMyProfile_GetMyProfile} from '../../types/api';
import withSuspense from '../../withSuspense';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Image, BackHandler} from 'react-native';
import constants from '../../constants';
import {getAge} from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import {toast} from '../../tools';

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

interface IProp {}

const Profile: React.FunctionComponent<IProp> = () => {
  const maxNameLength = 16;
  const navigation = useNavigation();
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

  //Exit event

  // let exitState = false;
  // let timeout: NodeJS.Timeout;

  // useEffect(() => {
  //   const backAction = () => {
  //     if (!exitState) {
  //       toast('한번 더 누르시면 종료됩니다.');
  //       exitState = true;
  //       timeout = setTimeout(() => {
  //         exitState = false;
  //       }, 2000);
  //     } else {
  //       clearTimeout(timeout);
  //       BackHandler.exitApp();
  //     }
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

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
    const {id, nickName, gender, birth, profilePhoto} = data.GetMyProfile.user;
    console.log(data.GetMyProfile.user);
    return (
      <ScrollView>
        <Container>
          <Wrapper>
            <InfoContainer>
              <ImageWrapper>
                <ImageTouchable>
                  <Image
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
                <EditTouchable onPress={editOnPress}>
                  <Icon name="form" size={26} />
                </EditTouchable>
              </BottomWrapper>
            </InfoContainer>
          </Wrapper>
        </Container>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView>
        <View>
          <Text>오류</Text>
        </View>
      </ScrollView>
    );
  }
};

export default withSuspense(Profile);
