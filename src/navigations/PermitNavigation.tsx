import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Permission from '../screens/Permit/Permission';

const Stack = createStackNavigator();

const PermitNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Permission"
        headerMode="none"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Permission" component={Permission} options={{}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default PermitNavigation;
