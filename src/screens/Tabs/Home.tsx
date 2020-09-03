import React, {useState, useEffect, useLayoutEffect} from 'react';
import {Alert, ActivityIndicator, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import {useMutation} from '@apollo/react-hooks';
import Geolocation from '@react-native-community/geolocation';
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack';
import {ReportMovement, ReportMovementVariables} from '../../types/api';
import {UPDATE_LOCATION} from './Home.queries';
import RequestPermission from '../../components/RequestPermission';
import HeaderTab from '../../components/HeaderTab';
import {TabProp} from '../../components/HeaderTab/HeaderTab';
import People from '../Home/People/People';
import Post from '../Home/Post/Post';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles';

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
  navigation: NavigationProp | any;
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

const Home: React.FunctionComponent<IProp> = ({navigation}) => {
  const [currentTab, setCurrentTab] = useState<TabProp>('people');
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <LinearGradient
          colors={[styles.backPrimaryColor, styles.backSubColor]}
          style={{flex: 1}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
      ),
      headerTitle: () => (
        <HeaderTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          headerHeight={headerHeight}
          voiceOnPress={() => navigation.navigate('VoiceNavigation')}
        />
      ),
    });
  }, [navigation]);

  const [userId, setUserId] = useState<number | null>(null);

  const [location, setLocation] = useState<LocationProp>({
    coords: {
      latitude: 126,
      longitude: 37,
    },
  });

  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [isGranted, setIsGranted] = useState<boolean>(false);

  const [updateLocationMutation] = useMutation<
    ReportMovement,
    ReportMovementVariables
  >(UPDATE_LOCATION);

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

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        translucent={true}
        backgroundColor={'transparent'}
      />
      {isRequested ? (
        isGranted ? (
          <SafeAreaView>
            {userId ? (
              currentTab === 'people' ? (
                <People
                  navigation={navigation}
                  userId={userId}
                  myLat={location.coords.latitude}
                  myLng={location.coords.longitude}
                />
              ) : (
                <Post userId={userId} />
              )
            ) : null}
          </SafeAreaView>
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

export default Home;
