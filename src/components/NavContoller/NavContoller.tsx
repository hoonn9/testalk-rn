import React, {useEffect} from 'react';
import {View} from 'react-native';
import AuthNavigation from '../../navigations/AuthNavigation';
import {
  useIsLoggedIn,
  useLogOut,
  useIsPermit,
  usePermit,
} from '../../AuthContext';
import MainNavigation from '../../navigations/MainNavigation';
import PermitNavigation from '../../navigations/PermitNavigation';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
export default () => {
  const isLoggedIn = useIsLoggedIn();
  const confirmPermit = usePermit();
  confirmPermit();

  const isPermit = useIsPermit();
  console.log('isLoggin:', isLoggedIn);
  console.log('권한 : ', isPermit);
  // const logout = useLogOut();
  // logout();
  //console.log(isLoggedIn);
  return (
    <NavigationContainer>
      <View style={{flex: 1}}>
        {isLoggedIn ? (
          !isPermit ? (
            <PermitNavigation />
          ) : (
            <MainNavigation />
          )
        ) : (
          <AuthNavigation />
        )}
      </View>
    </NavigationContainer>
  );
};
