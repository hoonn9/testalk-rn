import React from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery} from '@apollo/react-hooks';
import {GET_MY_PROFILE} from './Profile.queries';
import MyProfile from '../../components/MyProfile';
import {GetMyProfile, GetMyProfile_GetMyProfile} from '../../types/api';
import withSuspense from '../../withSuspense';
import {useNavigation} from '@react-navigation/native';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProp {}

const Profile: React.FunctionComponent<IProp> = () => {
  const navigation = useNavigation();
  const {loading, error, refetch, data} = useQuery<
    GetMyProfile,
    GetMyProfile_GetMyProfile
  >(GET_MY_PROFILE, {
    fetchPolicy: 'network-only',
  });

  if (
    data &&
    data.GetMyProfile &&
    data.GetMyProfile.ok &&
    data.GetMyProfile.user
  ) {
    const {id, nickName, gender, birth} = data.GetMyProfile.user;
    console.log('get profile');
    return (
      <ScrollView>
        <View>
          <MyProfile nickName={nickName} gender={gender} birth={birth} />
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
