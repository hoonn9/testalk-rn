import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  useCallback,
} from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import UserProfile from "../../components/UserProfile";
import { NavigationTabScreenProps } from "react-navigation-tabs";
import { GET_MY_PROFILE } from "./Profile.queries";
import MyProfile from "../../components/MyProfile";
import {
  ReportMovement,
  ReportMovementVariables,
  GetUserList,
  GetUserListVariables,
  GetUserList_GetUserList_users,
} from "../../types/api";
import withSuspense from "../../withSuspense";
import {
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import RequestPermission from "../../components/RequestPermission";
import { UPDATE_LOCATION, GET_USER_LIST } from "./People.queries";
import PeopleRowItem from "../../components/PeopleRowItem";
import { distance } from "../../utils";
import RowSeparator from "../../components/RowSeparator";
import { toast } from "../../tools";
import { withNavigation } from "react-navigation";
import Geolocation from '@react-native-community/geolocation';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const IndicatorView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProp extends NavigationTabScreenProps {}
interface LocationProp {
  coords: {
    latitude: number;
    longitude: number;
  };
}
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: "auto"
});
const People: React.FunctionComponent<IProp> = ({ navigation }) => {
  const [location, setLocation] = useState<LocationProp>({
    coords: {
      latitude: 126,
      longitude: 37,
    },
  });
  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [updateLocationMutation] = useMutation<
    ReportMovement,
    ReportMovementVariables
  >(UPDATE_LOCATION);

  const skipUnit = 10;
  const [listData, setListData] = useState<Array<any>>([]);
  const [updateTime, setUpdateTime] = useState<string>(Date.now().toString());
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(skipUnit);
  const [getUserListSkip, setGetUserListSkip] = useState<boolean>(true);
  const [flatRef, setFlatRef] = useState<
    | FlatList<GetUserList_GetUserList_users | null>
    | null
    | React.RefObject<unknown>
  >(() => createRef());
  const [getUserList, { called, loading, data, refetch }] = useLazyQuery<
    GetUserList,
    GetUserListVariables
  >(GET_USER_LIST, {
    variables: {
      means: "",
      requestTime: updateTime,
      skip,
      take,
    },
    onCompleted: (data) => {
      if (data) {
        setIsRefreshing(false);
        setGetUserListSkip(true);

        if (data.GetUserList.users) {
          setListData([...listData, ...data.GetUserList.users]);
        }
      }
    },
    onError: () => {
      setIsRefreshing(false);
      toast("유저 리스트를 불러올 수 없어요!");
    },
  });

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition((success) => {
        resolve(success);
        setIsRequested(true);
        setIsGranted(true);
      }, (error) => {
        reject(error);
        setIsRequested(true);
        setIsGranted(false);
      })
    }).catch(error => {
      console.log(error);
    });
  };

  const getLocation = async () => {
      const position: any = await getPosition();
      console.log(position);
      const { data } = await updateLocationMutation({
        variables: {
          lastLat: position.coords.latitude,
          lastLng: position.coords.longitude,
        },
        fetchPolicy: "no-cache",
      });
      if (!data?.ReportMovement.ok) {
        Alert.alert("위치 갱신 실패");
      }
      setLocation({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
      setIsRefreshing(true);
      setGetUserListSkip(false);
      getUserList();
        
      
  };

  const getDistance = (lat: number, lng: number) => {
    return distance(
      location.coords.latitude,
      location.coords.longitude,
      lat,
      lng,
      "K"
    );
  };

  const onRefresh = () => {
    console.log("스킵: ", getUserListSkip);
    setUpdateTime(Date.now().toString());
    setSkip(0);
    setListData([]);
  };

  const onEndReached = () => {
    // console.log("end");
    setSkip(skip + skipUnit);
    setGetUserListSkip(false);
    //.log(data?.GetUserList.users);
  };

  const infoOnPress = useCallback((id) => {
    console.log(id);
    //console.log(newSelected);
    navigation.navigate("MessageNavigation", { receiveUserId: id });
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("jwt");
      if (userId) {
        setUserId(parseInt(userId));
      } else {
        setUserId(null);
      }
      console.log(token);
    };
    getUserId();
    getLocation();
  }, []);

  //console.log(listData);
  return (
    <>
      {isRequested ? (
        isGranted ? (
          listData ? (
            <SafeAreaView>
              <FlatList
                ref={(list) => setFlatRef(list)}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                  />
                }
                keyExtractor={(e, i) => i.toString()}
                windowSize={5}
                data={listData}
                renderItem={(data) => {
                  return data.item?.id !== userId ? (
                    <PeopleRowItem
                      id={data.item?.id.toString()}
                      nickName={data.item?.nickName}
                      gender={data.item?.gender}
                      birth={data.item?.birth}
                      intro={data.item?.intro}
                      updatedAt={data.item?.updatedAt}
                      lastLat={data.item?.lastLat}
                      lastLng={data.item?.lastLng}
                      getDistance={getDistance}
                      onSelected={infoOnPress}
                    />
                  ) : null;
                }}
                ItemSeparatorComponent={() => <RowSeparator />}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.01}
              />
            </SafeAreaView>
          ) : (
            <IndicatorView>
              <ActivityIndicator />
            </IndicatorView>
          )
        ) : (
          <View>
            <RequestPermission callback={getLocation} name="위치" />
          </View>
        )
      ) : (
        <IndicatorView>
          <ActivityIndicator />
        </IndicatorView>
      )}
    </>
  );
};

export default withNavigation(People);
