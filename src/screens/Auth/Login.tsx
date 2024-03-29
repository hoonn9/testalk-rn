import React, {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import KakaoLogins from '@react-native-seoul/kakao-login';
import AuthButton from '../../components/AuthButton';
import {FIREBASE_WEB_ID} from '../../enviroments';
import {toast} from '../../tools';
import {useNavigation} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId: FIREBASE_WEB_ID,
  offlineAccess: true,
});

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

type SignUpParamList = {
  SignUpNavigation: {
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
  };
};
type LoginParamList = {
  LoginNavigation: {};
};

type SignUpNavigationProp = StackNavigationProp<
  SignUpParamList,
  'SignUpNavigation'
>;
type LoginNavigationProp = StackNavigationProp<
  LoginParamList,
  'LoginNavigation'
>;

interface IProp {
  navigation: any;
}

const FACEBOOK = 'FACEBOOK';
const GOOGLE = 'GOOGLE';
const KAKAO = 'KAKAO';

const SignUp: React.FunctionComponent<IProp> = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const googleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      console.log(result);
      toast(`${result.user.name}님 반가워요!`);
      navigation.navigate('SignUpNavigation', {
        ggId: result.idToken,
        fbId: null,
        kkId: null,
        means: GOOGLE,
      });
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
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const facebookOnPress = () => {
    try {
      setLoading(true);
      LoginManager.logInWithPermissions(['public_profile']).then(
        function(result) {
          if (result.isCancelled) {
          } else {
            const infoRequest = new GraphRequest(
              '/me',
              null,
              (error: any, result: any) => {
                if (error) {
                  toast('페이스북 계정과 연결을 실패했습니다.');
                } else {
                  toast(`${result.name}님 반가워요!`);
                  navigation.navigate('SignUpNavigation', {
                    ggId: null,
                    fbId: result.id,
                    kkId: null,
                    means: FACEBOOK,
                  });
                }
              },
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        },
        function(error) {
          console.log('Login fail with error: ' + error);
          toast('페이스북 계정과 연결을 실패했습니다.');
        },
      );
    } catch (error) {
      toast(`Facebook Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  console.log('check');
  const kakaoLogin = () => {
    setLoading(true);
    try {
      KakaoLogins.login()
        .then(result => {
          KakaoLogins.getProfile()
            .then(result => {
              if (result.id) {
                navigation.navigate('SignUpNavigation', {
                  ggId: null,
                  fbId: null,
                  kkId: result.id,
                  means: KAKAO,
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
          if (err.code === 'E_CANCELLED_OPERATION') {
          } else {
            toast(`Login Failed:${err.code} ${err.message}`);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Login = () => {
    try {
      console.log('login');
      navigation.navigate('LoginNavigation', {});
    } catch (error) {}
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthButton
          text="구글로 시작하기"
          onClick={googleLogin}
          loading={loading}
          bgColor="#000000"
        />
        <AuthButton
          text="페이스북으로 시작하기"
          onClick={facebookOnPress}
          loading={loading}
          bgColor="#000000"
        />
        <AuthButton
          text="카카오로 시작하기"
          onClick={kakaoLogin}
          loading={loading}
          bgColor="#000000"
        />
        <AuthButton
          text="기존 회원 로그인"
          onClick={Login}
          loading={loading}
          bgColor="#000000"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
