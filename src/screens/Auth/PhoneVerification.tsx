import React, {useState, useEffect} from 'react';
import {TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import useInput from '../../hooks/useInput';
import {Picker} from '@react-native-community/picker';
import {Alert} from 'react-native';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import {StackNavigationProp} from '@react-navigation/stack';
import AuthInput from '../../components/AuthInput';
import {useLogIn} from '../../AuthContext';
import {
  REQUEST_PHONE_VERIFICATION,
  CONFIRM_PHONE_VERIFICATION,
} from './PhoneVerification.queries';
import {
  StartPhoneVerification,
  StartPhoneVerificationVariables,
  CompletePhoneVerification,
  CompletePhoneVerificationVariables,
  GetCustomToken,
  GetCustomTokenVariables,
} from '../../types/api';
import countries from '../../countries';
import {toast, vibration} from '../../tools';
import {AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import {GET_CUSTOM_TOKEN} from './Login.queries';
import {RouteProp} from '@react-navigation/native';
const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Wrapper = styled.View`
  flex-direction: row;
  padding: 8px 16px;
`;
const MoreWrapper = styled.View`
  padding: 16px 0px;
`;
const InputWrapper = styled.View`
  flex: 5;
`;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: 'auto',
  },
  item: {
    flex: 1,
    paddingTop: 40,
    textAlign: 'right',
    backgroundColor: '#000',
    fontSize: 21,
  },
  picker: {
    flex: 2,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: 21,
  },
});

type RouteParamProp = {
  Login: {
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
  };
};

type PhoneVerificationRouteProp = RouteProp<RouteParamProp, 'Login'>;

type SignUpParamList = {
  SignUp: {
    token: string;
    userId: number;
    ggId: string | null;
    kkId: string | null;
    fbId: string | null;
    means: string;
  };
};

type NavigationProp = StackNavigationProp<SignUpParamList, 'SignUp'>;

interface IProp {
  route: PhoneVerificationRouteProp;
  navigation: NavigationProp;
}

const FACEBOOK = 'FACEBOOK';
const GOOGLE = 'GOOGLE';
const KAKAO = 'KAKAO';

const PhoneVerification: React.FunctionComponent<IProp> = ({
  route,
  navigation,
}) => {
  const {ggId, fbId, kkId, means} = route.params;
  // const ggId = navigation.getParam('ggId');
  // const fbId = navigation.getParam('fbId');
  // const kkId = navigation.getParam('kkId');
  // const means = navigation.getParam('means');
  const [dialCode, setDialCode] = useState<string>('+82');
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<boolean>(false);
  const phoneNumber = useInput('');
  const [dialPhoneNumber, setDialPhoneNumber] = useState<string>('');
  const secretCode = useInput('');
  const login = useLogIn();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const sortedCountries = countries.sort((a, b) => {
    return a.dial_code < b.dial_code ? -1 : a.dial_code > b.dial_code ? 1 : 0;
  });

  const [phoneMutation] = useMutation<
    StartPhoneVerification,
    StartPhoneVerificationVariables
  >(REQUEST_PHONE_VERIFICATION);

  const [confirmMutation] = useMutation<
    CompletePhoneVerification,
    CompletePhoneVerificationVariables
  >(CONFIRM_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: dialPhoneNumber,
      key: secretCode.value,
      fbId,
      ggId,
      kkId,
    },
    fetchPolicy: 'no-cache',
  });

  const [
    getCustomToken,
    {data: customTokenData, loading: customTokenLoading},
  ] = useLazyQuery<GetCustomToken>(GET_CUSTOM_TOKEN);

  const verifyMutation = async () => {
    if (!loading && !sendSuccess) {
      let isValid;
      let dialPhoneNumber;
      if (isGlobal) {
        dialPhoneNumber = dialCode + phoneNumber.value;
        setDialPhoneNumber(dialCode + phoneNumber.value);
        isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(dialPhoneNumber);
      } else {
        dialPhoneNumber =
          '+82' + phoneNumber.value.substring(1, phoneNumber.value.length);
        setDialPhoneNumber(
          '+82' + phoneNumber.value.substring(1, phoneNumber.value.length),
        );
        isValid = /^\d{3}\d{3,4}\d{4}$/.test(phoneNumber.value);
      }
      console.log(dialPhoneNumber);
      if (!isValid) {
        setIsError(true);
        vibration();
        toast('휴대폰 번호가 올바르지 않아요.');
        return;
      }

      setLoading(true);
      try {
        const {data} = await phoneMutation({
          variables: {phoneNumber: dialPhoneNumber},
        });

        console.log(data);

        if (data) {
          if (data.StartPhoneVerification) {
            if (data.StartPhoneVerification.ok) {
              setSendSuccess(true);
            } else {
              setSendSuccess(false);
              toast(
                data.StartPhoneVerification.error ||
                  '인증 번호를 전송하는데 실패하였습니다. 다시 시도하세요.',
              );
            }
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        setSendSuccess(false);
        Alert.alert('인증 번호를 전송하는데 실패하였습니다. 다시 시도하세요.');
      }
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!loading && sendSuccess && secretCode) {
      const isValid = /^\d{6}$/.test(secretCode.value);

      if (!isValid) {
        setVerifyError(true);
        vibration();
        toast('인증 번호가 올바르지 않아요.');
        return;
      }

      try {
        setLoading(true);
        const {data} = await confirmMutation();

        if (data) {
          if (data.CompletePhoneVerification) {
            if (data.CompletePhoneVerification.ok) {
              const {token, userId} = data.CompletePhoneVerification;

              setToken(token);
              setUserId(userId);

              if (data.CompletePhoneVerification.isNew) {
                if (token && userId) {
                  navigation.navigate('SignUp', {
                    token,
                    userId,
                    fbId,
                    ggId,
                    kkId,
                    means,
                  });
                } else {
                  toast('올바르지 않은 접근입니다.');
                }
              } else {
                if (means === FACEBOOK && fbId) {
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
                        login(data.CompletePhoneVerification.token, userId);
                      })
                      .catch(error => {
                        console.log(error);
                        toast('페이스북 연결 실패.');
                      });
                  }
                } else if (means === 'GOOGLE' && ggId) {
                  const googleCredential = auth.GoogleAuthProvider.credential(
                    ggId,
                  );

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
                } else if (means === KAKAO && kkId) {
                  const customToken = await getCustomToken({
                    variables: {means, socialId: kkId},
                  });
                  console.log(customToken);
                }
              }
            } else {
              setVerifyError(true);
              vibration();
              toast(
                data.CompletePhoneVerification.error ||
                  '인증 번호가 올바르지 않아요.',
              );
            }
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        Alert.alert(
          '코드를 인증하는 과정에서 오류가 발생했습니다. 다시 시도하세요.',
        );
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (means === 'KAKAO' && customTokenData) {
      if (customTokenData.GetCustomToken) {
        if (customTokenData.GetCustomToken.ok) {
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
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {!sendSuccess ? (
            !isGlobal ? (
              <>
                <Wrapper>
                  <InputWrapper>
                    <AuthInput
                      placeholder={"'-' 를 제외하고 입력해주세요."}
                      value={phoneNumber.value}
                      onChangeText={phoneNumber.onChange}
                      keyboardType="number-pad"
                      onSubmitEditing={verifyMutation}
                      isError={isError}
                      setIsError={setIsError}
                    />
                  </InputWrapper>
                </Wrapper>
                <AuthButton
                  text="인증 발송"
                  onClick={verifyMutation}
                  loading={loading}
                  bgColor="#000000"
                />
                <MoreWrapper>
                  <Touchable onPress={() => setIsGlobal(true)}>
                    <Text>{'해외 사용자의 경우 눌러주세요'}</Text>
                  </Touchable>
                </MoreWrapper>
              </>
            ) : (
              <>
                <Wrapper>
                  <Picker
                    style={styles.picker}
                    selectedValue={dialCode}
                    onValueChange={(e, i) => setDialCode(e.toString())}>
                    {sortedCountries.map((country, index) => (
                      <Picker.Item
                        label={country.dial_code}
                        key={index}
                        value={country.dial_code}
                      />
                    ))}
                  </Picker>
                  <InputWrapper>
                    <AuthInput
                      placeholder={'휴대폰 번호를 입력해주세요.'}
                      value={phoneNumber.value}
                      onChangeText={phoneNumber.onChange}
                      keyboardType="number-pad"
                      onSubmitEditing={verifyMutation}
                      isError={isError}
                      setIsError={setIsError}
                    />
                  </InputWrapper>
                </Wrapper>
                <AuthButton
                  text="인증 발송"
                  onClick={verifyMutation}
                  loading={loading}
                  bgColor="#000000"
                />
                <MoreWrapper>
                  <Touchable
                    onPress={() => {
                      setDialCode('+82');
                      setIsGlobal(false);
                    }}>
                    <Text>{'국내 사용자의 경우 눌러주세요'}</Text>
                  </Touchable>
                </MoreWrapper>
              </>
            )
          ) : (
            <>
              <Wrapper>
                <InputWrapper>
                  <AuthInput
                    placeholder={'인증 번호를 입력해주세요.'}
                    value={secretCode.value}
                    onChangeText={secretCode.onChange}
                    keyboardType="number-pad"
                    onSubmitEditing={verifyCode}
                    isError={verifyError}
                    setIsError={setVerifyError}
                  />
                </InputWrapper>
              </Wrapper>
              <AuthButton
                text="인증"
                onClick={verifyCode}
                loading={loading}
                bgColor="#000000"
              />
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PhoneVerification;
