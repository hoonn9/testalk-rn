import React, {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import useInput from '../../hooks/useInput';
import {Picker} from '@react-native-community/picker';
import {useMutation} from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import {StackNavigationProp} from '@react-navigation/stack';
import AuthInput from '../../components/AuthInput';
import {useLogIn} from '../../AuthContext';
import {
  REQUEST_LOGIN_PHONE_VERIFICATION,
  CONFIRM_LOGIN_PHONE_VERIFICATION,
} from './PhoneVerification.queries';
import {
  LoginStartPhoneVerification,
  LoginStartPhoneVerificationVariables,
  LoginCompletePhoneVerification,
  LoginCompletePhoneVerificationVariables,
} from '../../types/api';
import countries from '../../countries';
import {toast, vibration} from '../../tools';
import auth from '@react-native-firebase/auth';

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
  navigation: NavigationProp;
}

const PhoneVerification: React.FunctionComponent<IProp> = ({navigation}) => {
  const [dialCode, setDialCode] = useState<string>('+82');
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<boolean>(false);
  const phoneNumber = useInput('');
  const [dialPhoneNumber, setDialPhoneNumber] = useState<string>('');
  const secretCode = useInput('');
  const login = useLogIn();
  const [loading, setLoading] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const sortedCountries = countries.sort((a, b) => {
    return a.dial_code < b.dial_code ? -1 : a.dial_code > b.dial_code ? 1 : 0;
  });

  const [phoneMutation] = useMutation<
    LoginStartPhoneVerification,
    LoginStartPhoneVerificationVariables
  >(REQUEST_LOGIN_PHONE_VERIFICATION);

  const [confirmMutation] = useMutation<
    LoginCompletePhoneVerification,
    LoginCompletePhoneVerificationVariables
  >(CONFIRM_LOGIN_PHONE_VERIFICATION, {
    variables: {
      phoneNumber: dialPhoneNumber,
      key: secretCode.value,
    },
    fetchPolicy: 'no-cache',
  });

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
          if (data.LoginStartPhoneVerification) {
            if (data.LoginStartPhoneVerification.ok) {
              setSendSuccess(true);
            } else {
              setSendSuccess(false);
              toast(
                data.LoginStartPhoneVerification.error ||
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
        toast('인증 번호를 전송하는데 실패하였습니다. 다시 시도하세요.');
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
          console.log(data);
          if (data.LoginCompletePhoneVerification) {
            if (data.LoginCompletePhoneVerification.ok) {
              const {token, userId} = data.LoginCompletePhoneVerification;

              //Firebase Login
              auth()
                .signInAnonymously()
                .then(response => {
                  console.log('res:', response);
                  login(token, userId);
                })
                .catch(error => {
                  console.log(error);
                  toast('로그인 실패.');
                });
            } else {
              setVerifyError(true);
              vibration();
              toast(
                data.LoginCompletePhoneVerification.error ||
                  '인증 하는 과정에서 오류가 발생했어요. 다시 시도하세요.',
              );
            }
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        toast('인증 하는 과정에서 오류가 발생했어요. 다시 시도하세요.');
      }
      setLoading(false);
    }
  };

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
