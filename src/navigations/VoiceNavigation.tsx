import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Profile from '../screens/Tabs/Profile';
import Voice from '../screens/Voice/Voice';
type RouteParamProp = {
  VoiceNavigation: {};
};

type VoiceNavigationRouteProp = RouteProp<RouteParamProp, 'VoiceNavigation'>;
interface IProp {
  route: VoiceNavigationRouteProp;
}
const Stack = createStackNavigator();

const VoiceNavigation: FunctionComponent<IProp> = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName="Voice"
      headerMode="screen"
      mode="modal"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="Voice"
        component={Voice}
        options={{}}
        initialParams={{}}
      />
      <Stack.Screen name="Profile" component={Profile} options={{}} />
    </Stack.Navigator>
  );
};
export default VoiceNavigation;
