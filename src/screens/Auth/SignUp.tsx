import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components/native";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import SignUpForm from "../../components/SignUpForm";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

interface IProp extends NavigationStackScreenProps {}

type GenderProp = "male" | "female";

const Login: React.FunctionComponent<IProp> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const means = navigation.getParam("means");
  const fbId = navigation.getParam("fbId");
  const ggId = navigation.getParam("ggId");

  console.log(means, fbId, ggId);

  const nickName = useInput("");
  const [gender, setGender] = useState<GenderProp>("male");
  const [birth, setBirth] = useState<Date>(new Date(946728736000));

  const onNext = () => {
    if (nickName.value && gender && birth) {
      navigation.navigate("PhoneVerification", {
        nickName: nickName.value,
        gender,
        birth,
        fbId,
        ggId,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <SignUpForm
          nickName={nickName}
          gender={{ gender, setGender }}
          birth={{ birth, setBirth }}
          onNext={onNext}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
