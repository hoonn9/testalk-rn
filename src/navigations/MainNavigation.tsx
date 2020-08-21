import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import MessageNavigation from './MessageNavigation';
import EditProfileNavigation from './EditProfileNavigation';
import UploadPostNavigation from './UploadPostNavigation';
import ReadPostNavigation from './ReadPostNavigation';
import SettingNavigation from './SettingNavigation';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
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
      <Stack.Screen
        name="EditProfileNavigation"
        component={EditProfileNavigation}
        options={{}}
      />
      <Stack.Screen
        name="UploadPostNavigation"
        component={UploadPostNavigation}
        options={{}}
      />
      <Stack.Screen
        name="ReadPostNavigation"
        component={ReadPostNavigation}
        options={{}}
      />
      <Stack.Screen
        name="SettingNavigation"
        component={SettingNavigation}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
