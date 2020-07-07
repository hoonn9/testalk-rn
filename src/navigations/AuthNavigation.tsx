import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import PhoneVerification from '../screens/Auth/PhoneVerification';

const AuthNavigation = createStackNavigator(
  {
    Login,
    PhoneVerification,
    SignUp,
  },
  {
    headerMode: 'none',
  },
);

export default createAppContainer(AuthNavigation);
