import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {Alert, ActivityIndicator, RefreshControl, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack';
import {
  ReportMovement,
  ReportMovementVariables,
  GetUserList,
  GetUserListVariables,
  GetUserList_GetUserList_users_profilePhoto,
} from '../../types/api';
import {UPDATE_LOCATION, GET_USER_LIST} from './People.queries';
import RequestPermission from '../../components/RequestPermission';
import PeopleRow from '../../components/PeopleRow';
import RowSeparator from '../../components/RowSeparator';
import {distance} from '../../utils';
import {toast} from '../../tools';
import HeaderTab from '../../components/HeaderTab';
import {TabProp} from '../../components/HeaderTab/HeaderTab';

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

type FeedsTabParamList = {
  MessageNavigation: {
    userId: number;
    userInfo: {
      nickName: string;
      birth: number;
      gender: string;
      intro: string;
      profilePhoto: string;
    };
  };
  Profile: {
    userId: number;
  };
};

type NavigationProp = StackNavigationProp<
  FeedsTabParamList,
  'MessageNavigation'
>;
interface IProp {
  navigation: NavigationProp;
}

interface LocationProp {
  coords: {
    latitude: number;
    longitude: number;
  };
}

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'auto',
});

const People: React.FunctionComponent<IProp> = ({navigation}) => {
  const [currentTab, setCurrentTab] = useState<TabProp>('people');
  const headerHeight = useHeaderHeight();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          headerHeight={headerHeight}
        />
      ),
    });
  }, [navigation]);

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

  const [updateLocationMutation] = useMutation<
    ReportMovement,
    ReportMovementVariables
  >(UPDATE_LOCATION);

  const [getUserList] = useLazyQuery<GetUserList, GetUserListVariables>(
    GET_USER_LIST,
    {
      variables: {
        means: '',
        requestTime: updateTime,
        skip,
        take: PEOPLE_LIMIT,
      },
      onCompleted: data => {
        console.log(data);
        if (data) {
          setIsRefreshing(false);

          if (data.GetUserList.users) {
            setListData([...listData, ...data.GetUserList.users]);
            data.GetUserList.users.forEach(element => {
              if (element) console.log(element.profilePhoto);
            });
          }
        }
      },
      onError: () => {
        setIsRefreshing(false);
        toast('유저 리스트를 불러올 수 없어요!');
      },
    },
  );

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        success => {
          resolve(success);
          setIsRequested(true);
          setIsGranted(true);
        },
        error => {
          reject(error);
          setIsRequested(true);
          setIsGranted(false);
        },
      );
    }).catch(error => {
      console.log(error);
    });
  };

  const getLocation = async () => {
    const position: any = await getPosition();
    console.log(position);
    const {data} = await updateLocationMutation({
      variables: {
        lastLat: position.coords.latitude,
        lastLng: position.coords.longitude,
      },
      fetchPolicy: 'no-cache',
    });
    if (data && !data.ReportMovement.ok) {
      Alert.alert('위치 갱신 실패');
    }
    setLocation({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
    setIsRefreshing(true);
    getUserList();
  };

  const getDistance = (lat: number, lng: number) => {
    return distance(
      location.coords.latitude,
      location.coords.longitude,
      lat,
      lng,
      'K',
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
    navigation.navigate('MessageNavigation', {userId, userInfo});
  }, []);

  const imageOnPress = (id: number) => {
    navigation.navigate('Profile', {userId: id});
  };

  useEffect(() => {
    const getUserId = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('jwt');
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

  const sortProfilePhoto = (
    photos: Array<GetUserList_GetUserList_users_profilePhoto>,
  ) => {
    let photo = photos[0];
    for (let i = 1; i < photos.length; i++) {
      if (photo.id > photos[i].id) {
        photo = photos[i];
      }
    }
    return photo;
  };

  return (
    <>
      {isRequested ? (
        isGranted ? (
          listData ? (
            <SafeAreaView>
              {currentTab === 'people' ? (
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  keyExtractor={(e, i) => i.toString()}
                  windowSize={5}
                  data={listData}
                  renderItem={data => {
                    if (data.item) {
                      return data.item.id !== userId ? (
                        <PeopleRow
                          id={data.item.id}
                          nickName={data.item.nickName}
                          gender={data.item.gender}
                          birth={data.item.birth}
                          intro={data.item.intro}
                          profilePhoto={
                            data.item.profilePhoto &&
                            data.item.profilePhoto.length > 0
                              ? sortProfilePhoto(data.item.profilePhoto).url
                              : 'https://i.stack.imgur.com/l60Hf.png'
                          }
                          updatedAt={data.item.updatedAt}
                          lastLat={data.item.lastLat}
                          lastLng={data.item.lastLng}
                          getDistance={getDistance}
                          onSelected={infoOnPress}
                          imageOnPress={imageOnPress}
                        />
                      ) : null;
                    } else {
                      return null;
                    }
                  }}
                  ItemSeparatorComponent={() => <RowSeparator />}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={0.01}
                />
              ) : (
                <View>
                  <Text>dd</Text>
                </View>
              )}
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

export default People;
