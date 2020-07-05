import React, {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import styled from 'styled-components/native';
import useInput from '../../hooks/useInput';
import {Alert} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {
  FACEBOOK_APP_ID,
  GOOGLE_ID_ANDROID,
  GOOGLE_ID_IOS,
  FIREBASE_WEB_ID,
} from '../../enviroments';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {toast} from '../../tools';

GoogleSignin.configure({
  scopes: [],
  webClientId: FIREBASE_WEB_ID,
});

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

interface IProp extends NavigationStackScreenProps {}

const FACEBOOK = 'fb';
const GOOGLE = 'go';

const SignUp: React.FunctionComponent<IProp> = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const googleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      toast(`${result.user.name}님 반가워요!`);
      navigation.navigate('SignUp', {ggId: result.idToken, means: GOOGLE});
      setLoading(false);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      setLoading(false);
    }
  };

  const facebookOnPress = (error, result) => {
    try {
      setLoading(true);
      if (error) {
        toast('문제가 발생하여 페이스북 로그인에 실패하였습니다.');
      } else if (result.isCancelled) {
        toast('로그인이 취소 되었습니다.');
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          console.log(data);
          toast(`${'tsest'} ${'test'}님 반가워요!`);
          navigation.navigate('SignUp', {
            fbId: data.accessToken.toString(),
            means: FACEBOOK,
          });
        });
      }
    } catch (error) {
      toast(`Facebook Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthButton
          text="구글로 로그인"
          onClick={googleLogin}
          loading={loading}
          bgColor="#000000"
        />
        <LoginButton onLoginFinished={facebookOnPress} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
