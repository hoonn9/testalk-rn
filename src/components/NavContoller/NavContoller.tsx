import React from 'react';
import styled from 'styled-components/native';
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
import Indicator from '../Indicator';

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  width: 100%;
`;

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
      <SafeAreaView>
        {isLoggedIn ? (
          isPermit === null ? (
            <Indicator showing={true} />
          ) : isPermit === false ? (
            <PermitNavigation />
          ) : (
            <MainNavigation />
          )
        ) : (
          <AuthNavigation />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
};
