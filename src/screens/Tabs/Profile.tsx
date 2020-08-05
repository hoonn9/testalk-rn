import React from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/react-hooks';
import {GET_MY_PROFILE} from './MyProfile.queries';
import ProfileComponent from '../../components/Profile';
import {GetUserProfile, GetUserProfileVariables} from '../../types/api';
import withSuspense from '../../withSuspense';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {GET_USER_PROFILE} from './Profile.queries';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

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
  const {loading, error, refetch, data} = useQuery<
    GetUserProfile,
    GetUserProfileVariables
  >(GET_USER_PROFILE, {
    fetchPolicy: 'network-only',
    variables: {
      id: route.params.userId,
    },
  });

  if (
    data &&
    data.GetUserProfile &&
    data.GetUserProfile.ok &&
    data.GetUserProfile.user
  ) {
    const {
      id,
      nickName,
      gender,
      birth,
      profilePhoto,
    } = data.GetUserProfile.user;
    console.log('get profile');

    const photoUrls: Array<string> = [];
    if (profilePhoto) {
      profilePhoto.map(e => photoUrls.push(e.url));
    }

    return (
      <ScrollView>
        <View>
          <ProfileComponent
            nickName={nickName}
            gender={gender}
            birth={birth}
            profilePhoto={photoUrls}
          />
        </View>
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
