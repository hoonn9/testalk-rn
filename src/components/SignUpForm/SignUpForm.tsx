import React, { useState } from "react";
import styled from "styled-components/native";
import constants from "../../constants";
import {
  ActivityIndicator,
  TouchableOpacityProps,
  Platform,
  GestureResponderEvent,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextInputRow from "../TextInputRow";
import ToogleInput from "../RadioButton";
import AuthButton from "../AuthButton";
import { NavigationProp } from "react-navigation";
import { NavigationStackScreenProps } from "react-navigation-stack";
const Touchable = styled.TouchableOpacity``;

interface IContainer {
  bgColor: string;
}

const Container = styled.View`
  background-color: ${(props: any) => props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${`${constants.width}px`};
`;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const RowText = styled.Text``;

const TextInput = styled.TextInput``;

interface IProp extends TouchableOpacityProps {
  nickName: {
    value: string;
    onChange: Function;
  };
  gender: {
    gender: string;
    setGender: Function;
  };
  birth: {
    birth: Date;
    setBirth: Function;
  };
  onNext: (event: GestureResponderEvent) => void;
}

type DateModeProp = "time" | "date" | "datetime" | "countdown" | undefined;

const SignUpForm: React.FunctionComponent<IProp> = ({
  nickName,
  gender: genderState,
  birth: birthState,
  onNext,
}) => {
  const { gender, setGender } = genderState;
  const { birth, setBirth } = birthState;

  const [mode, setMode] = useState<DateModeProp>("date");
  const [show, setShow] = useState<boolean | undefined>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeDatePicker = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || birth;
    setShow(Platform.OS === "ios");
    setBirth(currentDate);
  };

  return (
    <Container>
      <Text>Form</Text>
      <TextInputRow
        title={"닉네임"}
        placeholder={""}
        value={nickName.value}
        onChange={nickName.onChange}
        keyboardType={"default"}
      />
      <ToogleInput
        title={"성별"}
        buttons={["male", "female"]}
        value={gender}
        setValue={setGender}
      />
      <RowText>{"생년월일"}</RowText>
      <Touchable onPress={() => setShow(!show)}>
        <TextInput editable={false} value={birth.toISOString()} />
      </Touchable>
      <AuthButton
        text="다음"
        bgColor="#000"
        onClick={onNext}
        loading={loading}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={birth}
          mode={mode}
          onChange={onChangeDatePicker}
        />
      )}
    </Container>
  );
};

export default SignUpForm;
