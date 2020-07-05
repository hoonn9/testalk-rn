import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import MessageNavigation from "./MessageNavigation";
import { createAppContainer } from "react-navigation";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    MessageNavigation,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {},
    },
    headerMode: "none",
    mode: "modal",
  }
);

export default createAppContainer(MainNavigation);
