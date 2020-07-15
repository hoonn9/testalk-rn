import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import styled from 'styled-components/native';
import {useLazyQuery} from '@apollo/react-hooks';
import {StackNavigationProp} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {AccessToken} from 'react-native-fbsdk';
import {useLogIn} from '../../AuthContext';
import {GET_CUSTOM_TOKEN} from './Login.queries';
import {GetCustomToken} from '../../types/api';
import useInput from '../../hooks/useInput';
import SignUpForm from '../../components/SignUpForm';
import {toast} from '../../tools';
import {RouteProp} from '@react-navigation/native';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

type RouteParamProp = {
  SignUpNavigation: {
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
  };
};

type SignUpRouteProp = RouteProp<RouteParamProp, 'SignUpNavigation'>;

type NavigationParamProp = {
  SignUpPhoneVerification: {
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
    nickName: string;
    gender: string;
    birth: string;
  };
};

type NavigationProp = StackNavigationProp<
  NavigationParamProp,
  'SignUpPhoneVerification'
>;

interface IProp {
  route: SignUpRouteProp;
  navigation: NavigationProp;
}

type GenderProp = 'male' | 'female';

const Login: React.FunctionComponent<IProp> = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const {means, fbId, ggId, kkId} = route.params;

  console.log(means, fbId, ggId, kkId);

  const nickName = useInput('');
  const [gender, setGender] = useState<GenderProp>('male');
  const [birth, setBirth] = useState<Date>(new Date(946728736000));

  const onNext = async () => {
    if ((ggId || fbId || kkId) && means && nickName.value && gender && birth) {
      navigation.navigate('SignUpPhoneVerification', {
        ggId,
        kkId,
        fbId,
        means,
        nickName: nickName.value,
        gender,
        birth: birth.toString(),
      });
    } else {
      // 폼 작성 안 됐을때
    }
  };

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
