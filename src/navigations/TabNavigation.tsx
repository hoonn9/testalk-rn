import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../screens/Tabs/Profile';
import React from 'react';
import {Platform} from 'react-native';
import NavIcon from '../components/NavIcon';
import People from '../screens/Tabs/People';
import ChatLink from '../components/ChatLink';
import Chat from '../screens/Tabs/Chat';
import MyProfile from '../screens/Tabs/MyProfile';
import Purchase from '../screens/Purchase/Purchase';
import HeaderTab from '../components/HeaderTab';

interface IProp {
  routeName: string;
  initialRoute: any;
  customConfig: any;
}

const Stack = createStackNavigator();

const PeopleTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={'People'}
      headerMode="screen"
      screenOptions={{
        title: 'People',
      }}>
      <Stack.Screen name="People" component={People} options={{}} />
      <Stack.Screen name="Profile" component={Profile} options={{}} />
    </Stack.Navigator>
  );
};

const ChatTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Chat'}
      headerMode="screen"
      screenOptions={{
        title: 'Chat',
      }}>
      <Stack.Screen name="Chat" component={Chat} options={{}} />
      <Stack.Screen name="Profile" component={Profile} options={{}} />
    </Stack.Navigator>
  );
};

const ProfileTab = () => {
  return (
    <Stack.Navigator
      initialRouteName={'MyProfile'}
      headerMode="screen"
      screenOptions={{
        title: 'Profile',
      }}>
      <Stack.Screen name="MyProfile" component={MyProfile} options={{}} />
      <Stack.Screen name="Profile" component={Profile} options={{}} />
      <Stack.Screen name="Purchase" component={Purchase} options={{}} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      backBehavior="none"
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#e91e63',
        style: {
          backgroundColor: '#EFEEEF',
        },
      }}>
      <Tab.Screen
        name="People"
        component={PeopleTab}
        options={{
          tabBarLabel: 'People',
          tabBarIcon: ({color, size, focused}) => (
            <NavIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatTab}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({color, size, focused}) => (
            <NavIcon
              packageName="MaterialCommunityIcons"
              focused={focused}
              name="chat-processing"
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={ProfileTab}
        options={{
          tabBarLabel: 'MyProfile',
          tabBarIcon: ({color, size, focused}) => (
            <NavIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
