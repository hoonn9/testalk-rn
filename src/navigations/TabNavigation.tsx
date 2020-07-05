import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Image } from "react-native";
import Profile from "../screens/Tabs/Profile";
import { View } from "react-native";
import React from "react";
import { Platform } from "react-native";
import styles from "../styles";
import NavIcon from "../components/NavIcon";
import People from "../screens/Tabs/People";
import ChatLink from "../components/ChatLink";
import Chat from "../screens/Chat/Chat";

const stackFactory = (initialRoute: any, customConfig: any) =>
  createStackNavigator(
    {
      Profile: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig,
          headerStyle: {},
        },
      },
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: undefined,
        headerTintColor: styles.blackColor,
        headerStyle: {},
      },
    }
  );

export default createBottomTabNavigator(
  {
    People: {
      screen: stackFactory(People, {
        title: "People",
        headerRight: () => <ChatLink />,
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-people" : "md-people"}
          />
        ),
      },
    },
    Chat: {
      screen: stackFactory(Chat, {
        title: "Chat",
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            packageName="MaterialCommunityIcons"
            focused={focused}
            name="chat-processing"
          />
        ),
      },
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: "Profile",
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-person" : "md-person"}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: "#EFEEEF",
      },
    },
  }
);
