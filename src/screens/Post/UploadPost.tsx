import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import styled from 'styled-components/native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import PostForm from '../../components/PostForm';
import {useMutation} from '@apollo/react-hooks';
import {UPLOAD_POST} from './Post.queries';
import {
  UploadPost as UploadPostApi,
  UploadPostVariables,
  PhotoTarget,
  PhotoObject,
} from '../../types/api.d';
import ImagePicker from 'react-native-image-picker';
import {toast} from '../../tools';
import {PhotoProp} from '../EditProfile/EditProfile';
import FloatButton from '../../components/FloatButton';
import Icon from 'react-native-vector-icons/Ionicons';
import getEnvVars from '../../enviroments';
import Modal from 'react-native-modal';
import {Platform} from 'react-native';
import axios from 'axios';
import styles from '../../styles';
import ModalSelector from '../../components/ModalSelector';
import Indicator from '../../components/Indicator';

const View = styled.View``;
const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  flex-direction: row;
  background-color: #ddd;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text``;
const ScrollView = styled.ScrollView``;
const FloatButtonWrapper = styled.View`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

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

interface IProp {}

const UploadPost: React.FunctionComponent<IProp> = ({}) => {
  const navigation = useNavigation();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const [uploadPostMutation] = useMutation<UploadPostApi, UploadPostVariables>(
    UPLOAD_POST,
    {
      variables: {
        title: title,
        content: content,
      },
    },
  );

  const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [removePhoto, setRemovePhoto] = useState<PhotoProp | {}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable onPress={() => setIsConfirmModal(true)}>
          <Text>완료</Text>
        </Touchable>
      ),
    });
  }, [content]);

  const [photoList, setPhotoList] = useState<Array<PhotoProp>>([]);

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

  const confirmOnPress = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (!title) {
      toast('제목이 비었어요.');
      return;
    } else if (!content) {
      toast('내용이 비었어요.');
      return;
    }

    const formData = new FormData();
    const newPhotos = photoList.filter(e => e.isNew);
    const postPhotosArray: Array<PhotoObject> = [];

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
          postPhotosArray.push({
            url: locationArray[i].url,
            key: locationArray[i].key,
            target: PhotoTarget.upload,
          });
        }
      } catch (error) {
        console.log(error);
        toast('이미지 업로드에 실패했어요. 다시 시도 해주세요.');
        setIsLoading(false);
        return;
      }
    }

    try {
      const {data} = await uploadPostMutation({
        variables: {
          content: content,
          title: title,
          postPhotos: postPhotosArray,
        },
      });
      if (data && data.UploadPost && data.UploadPost.ok) {
        console.log(data);
        setIsConfirmModal(false);
        toast('업로드가 완료되었어요.');
        navigation.goBack();
      } else {
        throw Error();
      }
    } catch (error) {
      setIsLoading(false);
      toast('업로드 중에 오류가 발생했어요.');
      console.log(error);
    }
  };

  const photoRemoveOnPress = (photo: PhotoProp) => {
    console.log('삭제');
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
      <Container>
        <PostForm
          photoList={photoList}
          setTitle={setTitle}
          setContent={setContent}
          photoRemoveOnPress={photoRemoveOnPress}
        />
      </Container>
      <FloatButtonWrapper>
        <FloatButton
          onPress={addPhotoOnPress}
          size={65}
          icon={<Icon name="camera" size={33} />}
        />
      </FloatButtonWrapper>
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
        <Indicator showing={isLoading} />
        <ModalSelector
          description="이대로 쓰실래요?"
          confirmEvent={isLoading ? () => null : confirmOnPress}
          confirmTitle="확인"
          cancelEvent={() => setIsConfirmModal(!isConfirmModal)}
        />
      </Modal>
    </>
  );
};

export default UploadPost;
