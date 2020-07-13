import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import PhoneVerification from '../screens/Auth/PhoneVerification';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        headerMode="screen"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Login" component={Login} options={{}} />
        <Stack.Screen
          name="PhoneVerification"
          component={PhoneVerification}
          options={{}}
        />
        <Stack.Screen name="SignUp" component={SignUp} options={{}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
