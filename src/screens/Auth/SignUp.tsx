import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {useLazyQuery} from '@apollo/react-hooks';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import auth from '@react-native-firebase/auth';
import {AccessToken} from 'react-native-fbsdk';
import {useLogIn} from '../../AuthContext';
import {GET_CUSTOM_TOKEN} from './Login.queries';
import {GetCustomToken, GetCustomTokenVariables} from '../../types/api';
import useInput from '../../hooks/useInput';
import SignUpForm from '../../components/SignUpForm';
import {toast} from '../../tools';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

interface IProp extends NavigationStackScreenProps {}

type GenderProp = 'male' | 'female';

const Login: React.FunctionComponent<IProp> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const login = useLogIn();
  const token = navigation.getParam('token');
  const userId = navigation.getParam('userId');
  const means = navigation.getParam('means');
  const fbId = navigation.getParam('fbId');
  const ggId = navigation.getParam('ggId');
  const kkId = navigation.getParam('kkId');

  //console.log(token, userId, means, fbId, ggId, kkId);

  const nickName = useInput('');
  const [gender, setGender] = useState<GenderProp>('male');
  const [birth, setBirth] = useState<Date>(new Date(946728736000));

  const [
    getCustomToken,
    {data: customTokenData, loading: customTokenLoading},
  ] = useLazyQuery<GetCustomToken, GetCustomTokenVariables>(GET_CUSTOM_TOKEN);

  const onNext = async () => {
    if (nickName.value && gender && birth) {
      if (token && userId) {
        if (means === 'FACEBOOK' && fbId) {
          const fbData = await AccessToken.getCurrentAccessToken();

          if (fbData) {
            const facebookCredential = auth.FacebookAuthProvider.credential(
              fbData.accessToken,
            );
            //Firebase Login
            auth()
              .signInWithCredential(facebookCredential)
              .then(response => {
                console.log('res:', response);
                login(token, userId);
              })
              .catch(error => {
                console.log(error);
                toast('페이스북 연결 실패.');
              });
          }
        } else if (means === 'GOOGLE' && ggId) {
          const googleCredential = auth.GoogleAuthProvider.credential(ggId);

          auth()
            .signInWithCredential(googleCredential)
            .then(response => {
              console.log('res:', response);
              login(token, userId);
            })
            .catch(error => {
              console.log(error);
              toast('구글 연결 실패.');
            });
        } else if (means === 'KAKAO' && kkId) {
          const customToken = await getCustomToken({
            variables: {means, socialId: kkId},
          });
          console.log(customToken);
        }
      } else {
        toast('잘못 된 접근입니다.');
      }
    } else {
      // 폼 작성 안 됐을때
    }
  };
  useEffect(() => {
    if (means === 'KAKAO' && customTokenData) {
      if (customTokenData.GetCustomToken && customTokenData.GetCustomToken.ok) {
        const customToken = customTokenData.GetCustomToken.token;
        if (customToken) {
          auth()
            .signInWithCustomToken(customToken)
            .then(response => {
              console.log('res:', response);
              login(token, userId);
            })
            .catch(error => {
              console.log(error);
              toast('카카오 연결 실패.');
            });
        } else {
          toast('잘못 된 접근입니다.');
        }
      } else {
        toast('권한이 없습니다.');
      }
    } else {
      toast('잘못 된 접근입니다.');
    }
  }, [customTokenData]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <SignUpForm
          nickName={nickName}
          gender={{gender, setGender}}
          birth={{birth, setBirth}}
          onNext={onNext}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
