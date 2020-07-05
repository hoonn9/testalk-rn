import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/native";
import { TextInputProps, Easing, Animated } from "react-native";
import constants from "../../constants";

const Container = styled.View`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  width: auto;
  padding: 10px;
  background-color: ${(props: any) => props.theme.greyColor};
  border: 2px solid ${(props: any) => props.theme.lightGreyColor};
  border-radius: 4px;
`;

interface IProp extends TextInputProps {
  isError?: boolean;
  setIsError?: Function;
}

const AuthInput: React.FunctionComponent<IProp> = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  onChangeText = () => null,
  returnKeyType = "done",
  onSubmitEditing = () => null,
  autoCorrect = true,
  isError = false,
  setIsError = () => null,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getStyle = () => {
    return {
      borderColor: "red",
      borderWidth: fadeAnim,
      borderRadius: 4,
    };
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
    }).start();
  };

  useEffect(() => {
    if (isError) {
      fadeAnim.setValue(2);
      fadeIn();
      setIsError(false);
    }
  }, [isError]);

  return (
    <Container>
      <Animated.View style={getStyle()}>
        <TextInput
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          value={value}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          autoCorrect={autoCorrect}
          onSubmitEditing={onSubmitEditing}
        />
      </Animated.View>
    </Container>
  );
};

export default AuthInput;
