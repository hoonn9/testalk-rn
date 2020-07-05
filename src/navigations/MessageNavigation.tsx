import { createStackNavigator } from "react-navigation-stack";
import Message from "../screens/Message/Message";
import Chat from "../screens/Chat/Chat";
import { createAppContainer } from "react-navigation";

const MessageNavigation = createStackNavigator(
  {
    Message,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {},
    },
  }
);

export default MessageNavigation;
