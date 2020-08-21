import React, {useLayoutEffect, useState, useEffect} from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  HeaderButtons,
  OverflowMenu,
  HiddenItem,
  HeaderButton,
} from 'react-navigation-header-buttons';
import {getUserInfoFromId, unblockFriend, blockFriend} from '../../dbTools';
import {toast} from '../../tools';
import ModalSelector from '../../components/ModalSelector';
const View = styled.View`
  flex: 1;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const SendMessageTouchable = styled.TouchableOpacity`
  width: 100%;
  position: absolute;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme.darkGreyColor};
`;
const SendMessageText = styled.Text`
  text-align: center;
  font-size: 16px;
  padding: 8px;
`;
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
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState<boolean>(
    false,
  );

  const MessageHeaderButton = () => {
    return (
      <HeaderButtons>
        <OverflowMenu
          OverflowIcon={
            <MaterialIcons
              name="more-vert"
              size={23}
              color={styles.whiteColor}
            />
          }>
          <HiddenItem
            title={isBlocked ? '차단 해제' : '차단하기'}
            onPress={() => setIsBlockModalVisible(true)}
          />
        </OverflowMenu>
      </HeaderButtons>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerRight: () => <MessageHeaderButton />,
    });
  }, [navigation, isBlocked]);

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

  const blockConfirmEvent = async () => {
    try {
      if (isBlocked) {
        unblockFriend(userId);
        setIsBlocked(false);
        toast('차단이 해제 되었어요.');
      } else {
        blockFriend(userId);
        setIsBlocked(true);
        toast('차단 완료 되었어요.');
      }
    } catch (error) {
      toast('차단 등록/해제 중 실패했어요.');
      console.log(error);
    } finally {
      setIsBlockModalVisible(false);
    }
  };

  const sendMessageOnPress = (id: number, userInfo: object) => {
    navigation.navigate('MessageNavigation', {userId: id, userInfo: userInfo});
  };

  useEffect(() => {
    const getUser = async () => {
      const getUserInfo = await getUserInfoFromId(userId);
      if (getUserInfo) {
        setIsBlocked(getUserInfo.blocked ? true : false);
      }
    };
    getUser();
  }, []);

  if (
    data &&
    data.GetUserProfile &&
    data.GetUserProfile.ok &&
    data.GetUserProfile.user &&
    data.GetUserProfile.isLiked !== null
  ) {
    const {
      user: {nickName, gender, birth, profilePhoto, intro},
      likeCount,
      isLiked,
    } = data.GetUserProfile;

    const photoUrls: Array<string> = [];
    if (profilePhoto && profilePhoto.length > 0) {
      profilePhoto.map(e => photoUrls.push(e.url));
    }

    return (
      <>
        <ScrollView>
          <View>
            <ProfileComponent
              id={userId}
              nickName={nickName}
              gender={gender}
              birth={birth}
              profilePhoto={photoUrls}
              likeCount={likeCount ? likeCount : 0}
              isLiked={isLiked}
              ImageOnPress={ImageOnPress}
            />
          </View>
        </ScrollView>
        <SendMessageTouchable
          onPress={() =>
            sendMessageOnPress(userId, {
              nickName,
              birth,
              gender,
              intro,
              profilePhoto:
                profilePhoto && profilePhoto.length > 0
                  ? profilePhoto[0].url
                  : undefined,
            })
          }>
          <SendMessageText>채팅 시작하기</SendMessageText>
        </SendMessageTouchable>
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
        <Modal
          isVisible={isBlockModalVisible}
          animationOut="fadeOutDown"
          backdropColor={styles.modalBackDropColor}
          backdropOpacity={0.3}
          backdropTransitionOutTiming={0}
          swipeDirection={['down']}
          onSwipeComplete={() => setIsBlockModalVisible(false)}>
          <ModalSelector
            description={
              isBlocked ? '차단을 해제하시겠어요?' : '상대를 차단하시겠어요?'
            }
            confirmEvent={blockConfirmEvent}
            confirmTitle="네"
            cancelEvent={() => setIsBlockModalVisible(false)}
          />
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
