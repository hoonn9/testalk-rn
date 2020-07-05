import React from "react";
import styled from "styled-components/native";
import { TextInputProps } from "react-native";

const Container = styled.View``;
const TextInput = styled.TextInput``;
const Text = styled.Text``;

interface IProp extends TextInputProps {
  title: string;
  onChange: any;
}

const TextInputRow: React.FunctionComponent<IProp> = ({
  title,
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  onChange = () => null,
  returnKeyType = "done",
  onSubmitEditing = () => null,
  autoCorrect = true,
}) => {
  return (
    <Container>
      <Text>{title}</Text>
      <TextInput
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        value={value}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        autoCorrect={autoCorrect}
        onSubmitEditing={onSubmitEditing}
      />
    </Container>
  );
};

export default TextInputRow;
