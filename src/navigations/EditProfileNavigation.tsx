import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import EditProfile from '../screens/Profile/EditProfile/EditProfile';
import {GetMyProfile_GetMyProfile_user} from '../types/api';

type RouteParamProp = {
  EditProfileNavigation: {
    user: GetMyProfile_GetMyProfile_user;
  };
};

type EditProfileNavigationRouteProp = RouteProp<
  RouteParamProp,
  'EditProfileNavigation'
>;
interface IProp {
  route: EditProfileNavigationRouteProp;
}
const Stack = createStackNavigator();

const EditProfileNavigation: FunctionComponent<IProp> = ({route}) => {
  console.log('EditNavigation', route.params);
  return (
    <Stack.Navigator
      initialRouteName="EditProfile"
      headerMode="screen"
      mode="modal"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{}}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};
export default EditProfileNavigation;
