import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from '../screens/Auth/SignUp';
import SignUpPhoneVerification from '../screens/Auth/SignUpPhoneVerification';

type RouteParamProp = {
  SignUpNavigation: {
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
  };
};

type SignUpNavigationRouteProp = RouteProp<RouteParamProp, 'SignUpNavigation'>;
interface IProp {
  route: SignUpNavigationRouteProp;
}

const Stack = createStackNavigator();

const SignUpNavigation: React.FunctionComponent<IProp> = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        initialParams={route.params}
        options={{}}
      />
      <Stack.Screen
        name="SignUpPhoneVerification"
        component={SignUpPhoneVerification}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default SignUpNavigation;
