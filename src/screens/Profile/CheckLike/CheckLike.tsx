import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {ActivityIndicator, RefreshControl, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useLazyQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack';
import {
  GetUserList_GetUserList_users_profilePhoto,
  GetLikeMeUserList,
  GetLikeMeUserListVariables,
  GetLikeMeUserList_GetLikeMeUserList_likes_likeUser,
} from '../../../types/api';
import PeopleRow from '../../../components/PeopleRow';
import RowSeparator from '../../../components/RowSeparator';
import {distance} from '../../../utils';
import {toast} from '../../../tools';
import {GET_LIKE_ME_USER_LIST} from './CheckLike.queries';

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

type CheckLikeProp = 'iLike' | 'likeMe';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'auto',
});

const CheckLike: React.FunctionComponent<IProp> = ({navigation}) => {
  const [currentTab, setCurrentTab] = useState<CheckLikeProp>('likeMe');
  const headerHeight = useHeaderHeight();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => null,
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
  const [listData, setListData] = useState<
    Array<GetLikeMeUserList_GetLikeMeUserList_likes_likeUser>
  >([]);
  const [updateTime, setUpdateTime] = useState<string>(Date.now().toString());
  const [skip, setSkip] = useState<number>(0);

  const [getLikeMeUser] = useLazyQuery<
    GetLikeMeUserList,
    GetLikeMeUserListVariables
  >(GET_LIKE_ME_USER_LIST, {
    variables: {
      requestTime: updateTime,
      skip,
      take: PEOPLE_LIMIT,
    },
    onCompleted: data => {
      console.log(data);
      if (data) {
        setIsRefreshing(false);
        const likes = data.GetLikeMeUserList.likes;
        if (likes) {
          const notNullList: GetLikeMeUserList_GetLikeMeUserList_likes_likeUser[] = [];

          likes.forEach(e => {
            if (e && e.likeUser) {
              notNullList.push(e.likeUser);
            }
          });
          setListData([...listData, ...notNullList]);
        }
      }
    },
    onError: () => {
      setIsRefreshing(false);
      toast('유저 리스트를 불러올 수 없어요!');
    },
  });

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
    getLikeMeUser();
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
      {listData ? (
        <SafeAreaView>
          {currentTab === 'likeMe' ? (
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
              renderItem={({item}) => {
                if (item) {
                  return item.id !== userId ? (
                    <PeopleRow
                      id={item.id}
                      nickName={item.nickName}
                      gender={item.gender}
                      birth={item.birth}
                      intro={item.intro}
                      profilePhoto={
                        item.profilePhoto && item.profilePhoto.length > 0
                          ? sortProfilePhoto(item.profilePhoto).url
                          : 'https://i.stack.imgur.com/l60Hf.png'
                      }
                      updatedAt={item.updatedAt}
                      lastLat={item.lastLat}
                      lastLng={item.lastLng}
                      onSelected={infoOnPress}
                      imageOnPress={imageOnPress}
                      getDistance={getDistance}
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
              renderItem={({item}) => {
                if (item) {
                  return item.id !== userId ? (
                    <PeopleRow
                      id={item.id}
                      nickName={item.nickName}
                      gender={item.gender}
                      birth={item.birth}
                      intro={item.intro}
                      profilePhoto={
                        item.profilePhoto && item.profilePhoto.length > 0
                          ? sortProfilePhoto(item.profilePhoto).url
                          : 'https://i.stack.imgur.com/l60Hf.png'
                      }
                      updatedAt={item.updatedAt}
                      lastLat={item.lastLat}
                      lastLng={item.lastLng}
                      onSelected={infoOnPress}
                      imageOnPress={imageOnPress}
                      getDistance={getDistance}
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
          )}
        </SafeAreaView>
      ) : (
        <IndicatorView>
          <ActivityIndicator />
        </IndicatorView>
      )}
    </>
  );
};

export default CheckLike;
