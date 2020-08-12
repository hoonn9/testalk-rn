import React, {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

interface IProps {
  isLoggedIn: boolean;
  setIsRoomIn: Function;
  children: any;
}

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FunctionComponent<IProps> = ({
  isLoggedIn: isLoggedInProp,
  setIsRoomIn,
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isLoggedInProp);
  const [isPermit, setIsPermit] = useState<boolean | null>(null);
  const logUserIn = async (token: string, userId: number) => {
    //console.log(token);
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('jwt', token);
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('jwt');
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  const RoomUserIn = () => {
    setIsRoomIn(true);
  };

  const RoomUserOut = () => {
    setIsRoomIn(false);
  };

  const permitUser = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        console.log(result);
        switch (result) {
          case RESULTS.GRANTED:
            setIsPermit(true);
            break;
          default:
            setIsPermit(false);
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isPermit,
        logUserIn,
        logUserOut,
        permitUser,
        RoomUserIn,
        RoomUserOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useIsLoggedIn = () => {
  const {isLoggedIn} = useContext(AuthContext);
  return isLoggedIn;
};

export const useLogOut = () => {
  const {logUserOut} = useContext(AuthContext);
  return logUserOut;
};

export const useIsPermit = () => {
  const {isPermit} = useContext(AuthContext);
  return isPermit;
};

export const usePermit = () => {
  const {permitUser} = useContext(AuthContext);
  return permitUser;
};

export const useLogIn = () => {
  const {logUserIn} = useContext(AuthContext);
  return logUserIn;
};

export const useRoomIn = () => {
  const {RoomUserIn} = useContext(AuthContext);
  return RoomUserIn;
};

export const useRoomOut = () => {
  const {RoomUserOut} = useContext(AuthContext);
  return RoomUserOut;
};
