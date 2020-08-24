import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import EditProfile from '../screens/Profile/EditProfile/EditProfile';
import UploadPost from '../screens/Home/Post/UploadPost';

interface IProp {}
const Stack = createStackNavigator();

const UploadPostNavigation: FunctionComponent<IProp> = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName="UploadPost"
      headerMode="screen"
      mode="modal"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen name="UploadPost" component={UploadPost} options={{}} />
    </Stack.Navigator>
  );
};
export default UploadPostNavigation;
