import React from 'react';
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

export default () => {
  const isLoggedIn = useIsLoggedIn();
  const confirmPermit = usePermit();

  confirmPermit();

  const isPermit = useIsPermit();
  console.log('권한 : ', isPermit);
  // const logout = useLogOut();
  // logout();
  //console.log(isLoggedIn);
  return (
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
  );
};
