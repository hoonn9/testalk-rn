import React, { useState, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import styled from "styled-components/native";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import AuthButton from "../../components/AuthButton";
import { NavigationStackScreenProps } from "react-navigation-stack";
import AuthInput from "../../components/AuthInput";
import { useLogIn } from "../../AuthContext";
import {
  REQUEST_PHONE_VERIFICATION,
  CONFIRM_PHONE_VERIFICATION,
} from "./PhoneVerification.queries";
import {
  StartPhoneVerification,
  StartPhoneVerificationVariables,
  CompletePhoneVerification,
  CompletePhoneVerificationVariables,
} from "../../types/api";
import countries from "../../countries";
import { toast, vibration } from "../../tools";
import constants from "../../constants";
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
const Picker = styled.Picker`
  flex: 2;
  width: auto;
  align-items: center;
  justify-content: flex-end;
  font-size: 21px;
`;
interface IProp extends NavigationStackScreenProps {}

const FACEBOOK = "fb";
const GOOGLE = "go";

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: "auto",
  },
  item: {
    flex: 1,
    paddingTop: 40,
    textAlign: "right",
    backgroundColor: "#000",
    fontSize: 21,
  },
});

const PhoneVerification: React.FunctionComponent<IProp> = ({ navigation }) => {
  const nickName = navigation.getParam("nickName");
  const gender = navigation.getParam("gender");
  const birth = navigation.getParam("birth");
  const fbId = navigation.getParam("fbId");
  const ggId = navigation.getParam("ggId");

  const [dialCode, setDialCode] = useState<string>("+82");
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<boolean>(false);
  const phoneNumber = useInput("");
  const [dialPhoneNumber, setDialPhoneNumber] = useState<string>("");
  const secretCode = useInput("");
  const login = useLogIn();
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
      nickName,
      gender,
      birth,
      phoneNumber: dialPhoneNumber,
      key: secretCode.value,
      fbId,
      ggId,
    },
    fetchPolicy: "no-cache",
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
          "+82" + phoneNumber.value.substring(1, phoneNumber.value.length);
        setDialPhoneNumber(
          "+82" + phoneNumber.value.substring(1, phoneNumber.value.length)
        );
        isValid = /^\d{3}\d{3,4}\d{4}$/.test(phoneNumber.value);
      }
      console.log(dialPhoneNumber);
      if (!isValid) {
        setIsError(true);
        vibration();
        toast("휴대폰 번호가 올바르지 않아요.");
        return;
      }

      setLoading(true);
      try {
        const { data } = await phoneMutation({
          variables: { phoneNumber: dialPhoneNumber },
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
                  "인증 번호를 전송하는데 실패하였습니다. 다시 시도하세요."
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
        Alert.alert("인증 번호를 전송하는데 실패하였습니다. 다시 시도하세요.");
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
        toast("인증 번호가 올바르지 않아요.");
        return;
      }

      console.log(secretCode.value);

      try {
        setLoading(true);
        const { data } = await confirmMutation();
        console.log(data);
        if (data) {
          if (data.CompletePhoneVerification) {
            if (data.CompletePhoneVerification.ok) {
              login(
                data.CompletePhoneVerification.token,
                data.CompletePhoneVerification.userId
              );
            } else {
              setVerifyError(true);
              vibration();
              toast(
                data.CompletePhoneVerification.error ||
                  "인증 번호가 올바르지 않아요."
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
          "코드를 인증하는 과정에서 오류가 발생했습니다. 다시 시도하세요."
        );
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
                    <Text>{"해외 사용자의 경우 눌러주세요"}</Text>
                  </Touchable>
                </MoreWrapper>
              </>
            ) : (
              <>
                <Wrapper>
                  <Picker
                    selectedValue={dialCode}
                    onValueChange={(e, i) => setDialCode(e)}
                  >
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
                      placeholder={"휴대폰 번호를 입력해주세요."}
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
                      setDialCode("+82");
                      setIsGlobal(false);
                    }}
                  >
                    <Text>{"국내 사용자의 경우 눌러주세요"}</Text>
                  </Touchable>
                </MoreWrapper>
              </>
            )
          ) : (
            <>
              <Wrapper>
                <InputWrapper>
                  <AuthInput
                    placeholder={"인증 번호를 입력해주세요."}
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
