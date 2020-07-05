import React, { useEffect } from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@apollo/react-hooks";
import UserProfile from "../../components/UserProfile";
import { NavigationTabScreenProps } from "react-navigation-tabs";
import { GET_MY_PROFILE } from "./Profile.queries";
import MyProfile from "../../components/MyProfile";
import { GetMyProfile, GetMyProfile_GetMyProfile } from "../../types/api";
import withSuspense from "../../withSuspense";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProp extends NavigationTabScreenProps {}

const Profile: React.FunctionComponent<IProp> = ({ navigation }) => {
  const { loading, error, refetch, data } = useQuery<GetMyProfile>(
    GET_MY_PROFILE,
    {
      fetchPolicy: "network-only",
    }
  );

  if (
    data &&
    data.GetMyProfile &&
    data.GetMyProfile.ok &&
    data.GetMyProfile.user
  ) {
    const { id, nickName, gender, birth } = data.GetMyProfile.user;
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
