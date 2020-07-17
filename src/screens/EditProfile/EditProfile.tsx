import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useMutation} from '@apollo/react-hooks';
import {GetMyProfile_GetMyProfile_user} from '../../types/api';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {StyleSheet, Image, Platform} from 'react-native';
import constants from '../../constants';
import {getAge} from '../../utils';
import Icon from 'react-native-vector-icons/AntDesign';
import EditProfilePhoto from '../../components/EditProfilePhoto';
import EditProfileAddPhoto from '../../components/EditProfileAddPhoto';
import ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {toast} from '../../tools';
import axios from 'axios';

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
  flex-direction: row;
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

interface PhotoListProp {
  id: number;
  url: string;
}

const EditProfile: React.FunctionComponent<IProp> = ({route}) => {
  const maxNameLength = 16;
  const navigation = useNavigation();
  const {id, nickName, gender, birth, profilePhoto} = route.params.user;
  const [photoList, setPhotoList] = useState<Array<PhotoListProp>>([]);

  useEffect(() => {
    if (profilePhoto && profilePhoto.length > 0) {
      for (let i = 0; i < profilePhoto.length; i++) {
        setPhotoList([
          ...photoList,
          {
            id: profilePhoto[i].id,
            url: profilePhoto[i].url,
          },
        ]);
      }
    }
  }, []);

  console.log(route.params.user);
  const formData = new FormData();
  console.log(formData);
  const addPhotoOnPress = () => {
    ImagePicker.showImagePicker(pickerOptions, response => {
      console.log('Response = ', response);
      response.type === '';
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const {uri, fileName} = response;
        if (fileName) {
          formData.append('file', {
            name: fileName,
            uri,
            type:
              Platform.OS === 'ios'
                ? fileName.split('.')[1].toLowerCase()
                : 'image/jpeg',
          });
          setPhotoList([...photoList, {id: -1, url: uri}]);
        }

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        //   this.setState({
        //     avatarSource: source,
        //   });
      }
    });
  };

  return (
    <ScrollView>
      <Container>
        <Wrapper>
          <InfoContainer>
            <ImageWrapper>
              {photoList &&
                photoList.map((e, i) => {
                  console.log(e);
                  return <EditProfilePhoto key={i} url={e.url} />;
                })}
              <EditProfileAddPhoto onPress={addPhotoOnPress} />
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
              <EditTouchable>
                <Icon name="form" size={26} />
              </EditTouchable>
            </BottomWrapper>
          </InfoContainer>
        </Wrapper>
      </Container>
    </ScrollView>
  );
};

export default EditProfile;
