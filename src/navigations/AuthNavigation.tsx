import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Auth/Login";
import SignUp from "../screens/Auth/SignUp";
import PhoneVerification from "../screens/Auth/PhoneVerification";

const AuthNavigation = createStackNavigator(
  {
    Login,
    SignUp,
    PhoneVerification,
  },
  {
    headerMode: "none",
  }
);

export default createAppContainer(AuthNavigation);
