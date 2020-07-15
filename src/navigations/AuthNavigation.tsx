import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Auth/Login';
import LoginNavigation from './LoginNavigation';
import SignUpNavigation from './SignUpNavigation';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen name="Login" component={Login} options={{}} />
      <Stack.Screen
        name="LoginNavigation"
        component={LoginNavigation}
        options={{}}
      />
      <Stack.Screen
        name="SignUpNavigation"
        component={SignUpNavigation}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
