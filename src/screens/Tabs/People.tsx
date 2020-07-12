import React, {
  useState,
  useEffect,
  createRef,
  useCallback,
} from "react";
import {
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { NavigationTabScreenProps } from "react-navigation-tabs";
import AsyncStorage from "@react-native-community/async-storage";
import { withNavigation } from "react-navigation";
import Geolocation from '@react-native-community/geolocation';
import {
  ReportMovement,
  ReportMovementVariables,
  GetUserList,
  GetUserListVariables,
  GetUserList_GetUserList_users,
} from "../../types/api";
import { UPDATE_LOCATION, GET_USER_LIST } from "./People.queries";
import RequestPermission from "../../components/RequestPermission";
import PeopleRow from "../../components/PeopleRow";
import RowSeparator from "../../components/RowSeparator";
import { distance } from "../../utils";
import { toast } from "../../tools";

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
  const PEOPLE_LIMIT = 10;

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
  const [listData, setListData] = useState<Array<any>>([]);
  const [updateTime, setUpdateTime] = useState<string>(Date.now().toString());
  const [skip, setSkip] = useState<number>(0);
  const [take, setTake] = useState<number>(PEOPLE_LIMIT);
  const [flatRef, setFlatRef] = useState<
  | FlatList<GetUserList_GetUserList_users | null>
  | null
  | React.RefObject<unknown>
  >(() => createRef());

  const [updateLocationMutation] = useMutation<
    ReportMovement,
    ReportMovementVariables
  >(UPDATE_LOCATION);

  const [getUserList] = useLazyQuery<
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
    setUpdateTime(Date.now().toString());
    setSkip(0);
    setListData([]);
  };

  const onEndReached = () => {
    setSkip(skip + PEOPLE_LIMIT);
  };

  const infoOnPress = useCallback((userId, userInfo) => {
    navigation.navigate("MessageNavigation", { userId, userInfo });
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
                    <PeopleRow
                      id={data.item?.id.toString()}
                      nickName={data.item?.nickName}
                      gender={data.item?.gender}
                      birth={data.item?.birth}
                      intro={data.item?.intro}
                      profilePhoto={"https://i.stack.imgur.com/l60Hf.png"}
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
