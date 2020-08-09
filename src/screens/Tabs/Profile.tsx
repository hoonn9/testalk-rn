import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/react-hooks';
import Modal from 'react-native-modal';
import {GET_MY_PROFILE} from './MyProfile.queries';
import ProfileComponent from '../../components/Profile';
import {GetUserProfile, GetUserProfileVariables} from '../../types/api';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {GET_USER_PROFILE} from './Profile.queries';
import FastImage from 'react-native-fast-image';
import styles from '../../styles';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const View = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const ModalBackButton = styled.TouchableOpacity`
  position: absolute;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: flex-end;
  right: 0;
  top: 0;
`;
const styleSheets = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

type ProfileRouteProp = {
  People: {
    userId: number;
  };
};

type ProfileScreenRouteProp = RouteProp<ProfileRouteProp, 'People'>;

interface IProp {
  route: ProfileScreenRouteProp;
}

const Profile: React.FunctionComponent<IProp> = ({route}) => {
  const navigation = useNavigation();
  const {userId} = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerRight: () => null,
    });
  }, [navigation]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>('');

  const {loading, error, refetch, data} = useQuery<
    GetUserProfile,
    GetUserProfileVariables
  >(GET_USER_PROFILE, {
    fetchPolicy: 'network-only',
    variables: {
      id: userId,
    },
  });

  const ImageOnPress = (url: string) => {
    setIsModalVisible(true);
    setModalImage(url);
  };

  if (
    data &&
    data.GetUserProfile &&
    data.GetUserProfile.ok &&
    data.GetUserProfile.user
  ) {
    const {
      user: {nickName, gender, birth, profilePhoto},
      likeCount,
    } = data.GetUserProfile;

    const photoUrls: Array<string> = [];
    if (profilePhoto) {
      profilePhoto.map(e => photoUrls.push(e.url));
    }

    return (
      <>
        <ScrollView>
          <View>
            <ProfileComponent
              nickName={nickName}
              gender={gender}
              birth={birth}
              profilePhoto={photoUrls}
              likeCount={likeCount}
              ImageOnPress={ImageOnPress}
            />
          </View>
        </ScrollView>
        <Modal
          isVisible={isModalVisible}
          animationOut="fadeOutDown"
          backdropColor={styles.blackColor}
          backdropOpacity={0.8}
          backdropTransitionOutTiming={0}
          swipeDirection={['down']}
          onSwipeComplete={() => setIsModalVisible(!isModalVisible)}
          onBackButtonPress={() => setIsModalVisible(false)}>
          <View>
            <FastImage
              style={styleSheets.image}
              source={{uri: modalImage}}
              resizeMode={FastImage.resizeMode.contain}
            />
            <ModalBackButton onPress={() => setIsModalVisible(false)}>
              <Icon name="remove" size={21} color={styles.whiteColor} />
            </ModalBackButton>
          </View>
        </Modal>
      </>
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

export default Profile;
