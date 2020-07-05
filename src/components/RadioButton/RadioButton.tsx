import React from "react";
import styled from "styled-components/native";
import { TextInputProps, TouchableOpacityProps } from "react-native";
import constants from "../../constants";

const Container = styled.View``;
const Title = styled.Text``;
const Text = styled.Text`
  text-align: center;
`;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
interface TouchableViewProp {
  len: number;
}
const TouchableView = styled.View<TouchableViewProp>`
  width: ${(props: any) => `${constants.width / props.len}px`};
`;
const Touchable = styled.TouchableOpacity``;
interface IProp extends TextInputProps {
  title: string;
  buttons: Array<string>;
  value: string;
  setValue: Function;
}

const RadioButton: React.FunctionComponent<IProp> = ({
  title,
  buttons,
  value,
  setValue,
}) => {
  const onChangeUseState = (e: string) => {
    if (value !== e) {
      setValue(e);
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Wrapper>
        {buttons.map((e, i) => {
          return (
            <Touchable key={i} onPress={() => onChangeUseState.bind(null)(e)}>
              <TouchableView len={buttons.length}>
                <Text>{e}</Text>
              </TouchableView>
            </Touchable>
          );
        })}
      </Wrapper>
    </Container>
  );
};

export default RadioButton;
