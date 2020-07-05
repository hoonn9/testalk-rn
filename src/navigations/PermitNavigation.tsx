import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Permission from "../screens/Permit/Permission";

const PermitNavigation = createStackNavigator(
  {
    Permission,
  },
  {
    headerMode: "none",
  }
);

export default createAppContainer(PermitNavigation);
