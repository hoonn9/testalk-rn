import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Message from '../screens/Message/Message';
import {RouteProp} from '@react-navigation/native';

type RouteParamProp = {
  MessageNavigation: {
    userId: number;
    userInfo: {
      nickName: string;
      birth: number;
      gender: string;
      intro: string;
      profilePhoto: string;
    };
  };
};

type MessageNavigationRouteProp = RouteProp<
  RouteParamProp,
  'MessageNavigation'
>;
interface IProp {
  route: MessageNavigationRouteProp;
}
const Stack = createStackNavigator();

const MessageNavigation: FunctionComponent<IProp> = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName="Message"
      headerMode="screen"
      mode="modal"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="Message"
        component={Message}
        options={{}}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};
export default MessageNavigation;
