import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPhoneVerification from '../screens/Auth/LoginPhoneVerification';

const Stack = createStackNavigator();

const LoginNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginPhoneVerification"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="LoginPhoneVerification"
        component={LoginPhoneVerification}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigation;
