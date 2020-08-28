import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Setting from '../screens/Setting/Setting';
import NotificationSetting from '../screens/Setting/NotificationSetting';
import BlockSetting from '../screens/Setting/BlockSetting';

type RouteParamProp = {
  SettingNavigation: {};
};

type SettingNavigationRouteProp = RouteProp<
  RouteParamProp,
  'SettingNavigation'
>;
interface IProp {
  route: SettingNavigationRouteProp;
}

const Stack = createStackNavigator();

const SettingNavigation: React.FunctionComponent<IProp> = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName="Setting"
      headerMode="screen"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="Setting"
        component={Setting}
        initialParams={route.params}
        options={{}}
      />
      <Stack.Screen name="BlockSetting" component={BlockSetting} options={{}} />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{}}
      />
    </Stack.Navigator>
  );
};

export default SettingNavigation;
