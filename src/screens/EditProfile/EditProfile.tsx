import React, {useEffect, useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useMutation} from '@apollo/react-hooks';
import {
  GetMyProfile_GetMyProfile_user,
  PhotoObject,
  UpdateUserProfile,
  UpdateUserProfileVariables,
} from '../../types/api';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {Platform, GestureResponderEvent} from 'react-native';
import Modal from 'react-native-modal';
import constants from '../../constants';
import EditProfilePhoto from '../../components/EditProfilePhoto';
import EditProfileAddPhoto from '../../components/EditProfileAddPhoto';
import ImagePicker from 'react-native-image-picker';
import {toast} from '../../tools';
import axios from 'axios';
import getEnvVars from '../../enviroments';
import {UPDATE_USER_PROFILE} from './EditProfile.queries';
import styles from '../../styles';
import ModalSelector from '../../components/ModalSelector';
import TextInputRow from '../../components/TextInputRow';

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
  flex-direction: row;
`;
const ImageBottomWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
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

const InputWrapper = styled.View`
  width: 100%;
  margin: 8px 16px;
`;

const ScrollView = styled.ScrollView``;

type RouteParamProp = {
  EditProfile: {
    user: GetMyProfile_GetMyProfile_user;
  };
};
type EditProfileRouteProp = RouteProp<RouteParamProp, 'EditProfile'>;

interface IProp {
  route: EditProfileRouteProp;
}

const pickerOptions = {
  title: '사진 선택',
  cancelButtonTitle: '취소',
  takePhotoButtonTitle: '카메라',
  chooseFromLibraryButtonTitle: '갤러리',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  permissionDenied: {
    title: '권한이 거부되었습니다.',
    text:
      '사진을 가져오려면 저장공간, 카메라 접근이 필요합니다. 직접 허용해주세요. (어플리케이션 설정 - 권한 => 저장공간, 카메라 ON)',
    reTryTitle: '허용하기',
    okTitle: '취소',
  },
};

export interface PhotoProp {
  id: number;
  uri: string;
  key: string;
  isNew: boolean;
  fileName: string;
}

enum PhotoTarget {
  delete = 'delete',
  upload = 'upload',
}

interface EditButtonProp {
  onPress: (event: GestureResponderEvent) => void;
}

const EditProfile: React.FunctionComponent<IProp> = ({route}) => {
  const maxNameLength = 16;
  const navigation = useNavigation();

  const {
    id,
    nickName: prevNickName,
    gender,
    birth: prevBirth,
    profilePhoto,
    intro: prevIntro,
  } = route.params.user;
  const [photoList, setPhotoList] = useState<Array<PhotoProp>>([]);
  const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [removePhoto, setRemovePhoto] = useState<PhotoProp | {}>({});
  const [nickName, setNickName] = useState<string>(prevNickName);
  const [birth, setBirth] = useState<string>(prevBirth);
  const [intro, setIntro] = useState<string>(prevIntro);

  const [editProfileMutation] = useMutation<
    UpdateUserProfile,
    UpdateUserProfileVariables
  >(UPDATE_USER_PROFILE);

  // 헤더 버튼 생성
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <EditConfirmButton onPress={() => setIsConfirmModal(!isConfirmModal)} />
      ),
    });
  }, [navigation, photoList]);

  const EditConfirmButton: React.FunctionComponent<EditButtonProp> = ({
    onPress,
  }) => {
    return (
      <Touchable onPress={onPress}>
        <Text>{'완료'}</Text>
      </Touchable>
    );
  };

  useEffect(() => {
    if (profilePhoto && profilePhoto.length > 0) {
      if (photoList) {
        setPhotoList([]);
      }
      for (let i = 0; i < profilePhoto.length; i++) {
        setPhotoList(prevPhotoList => [
          ...prevPhotoList,
          {
            id: profilePhoto[i].id,
            uri: profilePhoto[i].url,
            key: profilePhoto[i].key,
            isNew: false,
            fileName: '',
          },
        ]);
      }
    }
  }, []);

  const addPhotoOnPress = () => {
    ImagePicker.showImagePicker(pickerOptions, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const {uri, fileName} = response;

        if (fileName) {
          setPhotoList(prevPhotoList => [
            ...prevPhotoList,
            {id: -1, uri, key: '', isNew: true, fileName},
          ]);
        }
      }
    });
  };

  useEffect(() => {
    console.log(photoList);
  }, [photoList]);

  const editConfirm = async () => {
    if (!nickName) {
      toast('이름이 비었어요.');
      return;
    } else if (!intro) {
      toast('소개가 비었어요.');
      return;
    } else if (!birth) {
      toast('생일이 비었어요.');
      return;
    }

    const formData = new FormData();
    const newPhotos = photoList.filter(e => e.isNew);
    const profilePhotoArray: Array<PhotoObject> = [];

    if (profilePhoto && profilePhoto.length > 0) {
      const removedPhotos = profilePhoto.filter((element, index) => {
        const temp = photoList.find((photo, i) => {
          console.log(element.url, photo.uri);
          if (photo.isNew || photo.uri !== element.url) {
            return false;
          } else {
            return true;
          }
        });
        return !temp;
      });

      for (let i = 0; i < removedPhotos.length; i++) {
        profilePhotoArray.push({
          url: removedPhotos[i].url,
          key: removedPhotos[i].key,
          target: PhotoTarget.delete,
        });
      }
    }

    if (newPhotos.length > 0) {
      try {
        newPhotos.map((element, index) => {
          formData.append('file', {
            name: element.fileName,
            uri: element.uri,
            type:
              Platform.OS === 'ios'
                ? element.fileName.split('.')[1].toLowerCase()
                : 'image/jpeg',
          });
        });

        const {
          data: {locationArray},
        } = await axios
          .post(`${getEnvVars().apiUrl}api/upload`, formData, {
            headers: {
              'Content-type': 'multipart/form-data',
            },
          })
          .then((e: any) => {
            console.log(e);
            return e;
          })
          .catch(e => {
            toast('이미지 업로드에 실패했어요. 다시 시도 해주세요.');
            console.log(e, 'error');
          });

        for (let i = 0; i < locationArray.length; i++) {
          profilePhotoArray.push({
            url: locationArray[i].url,
            key: locationArray[i].key,
            target: PhotoTarget.upload,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const {data} = await editProfileMutation({
        variables: {
          nickName: nickName,
          intro: intro,
          profilePhoto: profilePhotoArray,
        },
      });
      if (data && data.UpdateUserProfile && data.UpdateUserProfile.ok) {
        console.log(data);
        toast('수정이 완료되었어요.');
        navigation.goBack();
      } else {
        throw Error();
      }
    } catch (error) {
      toast('프로필을 수정하는 도중 오류가 발생했어요.');
      console.log(error);
    }
  };

  const photoRemoveOnPress = (photo: PhotoProp) => {
    console.log('삭제');
    console.log(photo);
    setIsRemoveModal(true);
    setRemovePhoto(photo);
  };

  const removePhotoCallback = () => {
    console.log('이미지 삭제');
    setIsRemoveModal(false);
    const removePhotoIndex = photoList.findIndex(
      element => element === removePhoto,
    );
    console.log(removePhotoIndex);
    photoList.splice(removePhotoIndex, 1);
    console.log(photoList);
  };

  return (
    <>
      <ScrollView>
        <Container>
          <Wrapper>
            <InfoContainer>
              <ImageWrapper>
                {photoList &&
                  photoList
                    .filter((_, index) => index <= 2)
                    .map((photo, index) => {
                      return (
                        <EditProfilePhoto
                          key={index}
                          photo={photo}
                          removeOnPress={photoRemoveOnPress}
                        />
                      );
                    })}
                {photoList.length < 5 ? (
                  <EditProfileAddPhoto onPress={addPhotoOnPress} />
                ) : null}
              </ImageWrapper>
              {photoList.length > 2 ? (
                <ImageBottomWrapper>
                  {photoList &&
                    photoList
                      .filter((_, index) => index > 2)
                      .map((photo, index) => {
                        console.log(photo);
                        return (
                          <EditProfilePhoto
                            key={index}
                            photo={photo}
                            removeOnPress={photoRemoveOnPress}
                          />
                        );
                      })}
                  {photoList.length < 5 ? (
                    <EditProfileAddPhoto onPress={addPhotoOnPress} />
                  ) : null}
                </ImageBottomWrapper>
              ) : null}
              <BottomWrapper>
                <InputWrapper>
                  <TextInputRow
                    title="닉네임"
                    value={nickName}
                    onChange={(text: string) => setNickName(text)}
                  />
                </InputWrapper>
                <InputWrapper>
                  <TextInputRow
                    title="나의 소개"
                    value={intro}
                    onChange={(text: string) => setIntro(text)}
                  />
                </InputWrapper>
              </BottomWrapper>
            </InfoContainer>
          </Wrapper>
        </Container>
      </ScrollView>
      <Modal
        isVisible={isRemoveModal}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}
        swipeDirection={['down']}
        onSwipeComplete={() => setIsRemoveModal(!isRemoveModal)}>
        <ModalSelector
          description="사진을 지우실래요?"
          confirmEvent={removePhotoCallback}
          confirmTitle="확인"
          cancelEvent={() => setIsRemoveModal(!isRemoveModal)}
        />
      </Modal>
      <Modal
        isVisible={isConfirmModal}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}
        swipeDirection={['down']}
        onSwipeComplete={() => setIsConfirmModal(!isConfirmModal)}>
        <ModalSelector
          description="이대로 수정하실래요?"
          confirmEvent={editConfirm}
          confirmTitle="확인"
          cancelEvent={() => setIsConfirmModal(!isConfirmModal)}
        />
      </Modal>
    </>
  );
};

export default EditProfile;
