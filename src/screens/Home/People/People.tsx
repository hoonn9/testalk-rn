import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  FlatList,
  StatusBar,
} from 'react-native';
import styled from 'styled-components/native';
import {useLazyQuery} from '@apollo/react-hooks';
import Geolocation from '@react-native-community/geolocation';
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack';
import {
  GetUserList,
  GetUserListVariables,
  GetUserList_GetUserList_users_profilePhoto,
  GetUserListMeans,
} from '../../../types/api.d';
import {GET_USER_LIST} from './People.queries';
import PeopleRow from '../../../components/PeopleRow';
import RowSeparator from '../../../components/RowSeparator';
import {distance} from '../../../utils';
import {toast} from '../../../tools';
import HeaderCategoryTab from '../../../components/HeaderCategoryTab';

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
  userId: number;
  myLat: number;
  myLng: number;
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

export type CategoryType = 'login' | 'distance' | 'hot' | 'join';
export interface CategoryProp {
  name: string;
  type: GetUserListMeans;
}
const People: React.FunctionComponent<IProp> = ({
  navigation,
  userId,
  myLat,
  myLng,
}) => {
  console.log('render people');
  const headerHeight = useHeaderHeight();
  const PEOPLE_LIMIT = 10;

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [listData, setListData] = useState<Array<any>>([]);
  const [updateTime, setUpdateTime] = useState<string>(Date.now().toString());
  const [skip, setSkip] = useState<number>(0);

  const [category, setCategory] = useState<GetUserListMeans>(
    GetUserListMeans.login,
  );

  const [getUserList] = useLazyQuery<GetUserList, GetUserListVariables>(
    GET_USER_LIST,
    {
      variables: {
        means: category,
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

  const getDistance = (lat: number, lng: number) => {
    return distance(myLat, myLng, lat, lng, 'K');
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
    getUserList();
  }, []);

  useEffect(() => {
    setListData([]);
  }, [category]);

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

  const categories: Array<CategoryProp> = [
    {name: '로그인', type: GetUserListMeans.login},
    {name: '근처', type: GetUserListMeans.distance},
    {name: '인기', type: GetUserListMeans.hot},
    {name: '가입', type: GetUserListMeans.join},
  ];

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <HeaderCategoryTab
        categories={categories}
        category={category}
        setCategory={setCategory}
        headerHeight={headerHeight}
      />
      {listData ? (
        <SafeAreaView>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
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
        </SafeAreaView>
      ) : (
        <IndicatorView>
          <ActivityIndicator />
        </IndicatorView>
      )}
    </>
  );
};

export default People;
