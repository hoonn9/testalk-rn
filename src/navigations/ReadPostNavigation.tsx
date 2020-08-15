import React, {FunctionComponent} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ReadPost from '../screens/Post/ReadPost';
import {RouteProp} from '@react-navigation/native';
import {GetPostList_GetPostList_posts} from '../types/api';
type RouteParamProp = {
  ReadPostNavigation: {
    post: GetPostList_GetPostList_posts;
  };
};

type ReadPostNavigationRouteProp = RouteProp<
  RouteParamProp,
  'ReadPostNavigation'
>;
interface IProp {
  route: ReadPostNavigationRouteProp;
}
const Stack = createStackNavigator();

const ReadPostNavigation: FunctionComponent<IProp> = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName="ReadPost"
      headerMode="screen"
      mode="modal"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'tomato'},
      }}>
      <Stack.Screen
        name="ReadPost"
        component={ReadPost}
        options={{}}
        initialParams={route.params}
      />
    </Stack.Navigator>
  );
};
export default ReadPostNavigation;
