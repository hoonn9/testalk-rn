import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import MessageNavigation from './MessageNavigation';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabNavigation"
        headerMode="none"
        mode="modal"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{}}
        />
        <Stack.Screen
          name="MessageNavigation"
          component={MessageNavigation}
          options={{}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
