import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Permission from '../screens/Permit/Permission';

const Stack = createStackNavigator();

const PermitNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Permission"
      headerMode="none"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen name="Permission" component={Permission} options={{}} />
    </Stack.Navigator>
  );
};

export default PermitNavigation;
