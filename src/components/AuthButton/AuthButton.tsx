import React from "react";
import styled from "styled-components/native";
import constants from "../../constants";
import {
  ActivityIndicator,
  TouchableOpacityProps,
  GestureResponderEvent,
} from "react-native";

const Touchable = styled.TouchableOpacity``;

interface IContainer {
  bgColor: string;
}

const Container = styled.View<IContainer>`
  background-color: ${(props: any) =>
    props.bgColor ? props.bgColor : props.theme.blueColor};
  padding: 10px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${`${constants.width / 1.7}px`};
`;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

interface IProp extends TouchableOpacityProps {
  text: string;
  loading: boolean;
  bgColor?: any;
  onClick: (event: GestureResponderEvent) => void;
}

const AuthButton: React.FC<IProp> = ({
  text,
  onClick = () => null,
  loading = false,
  bgColor = null,
}) => (
  <Touchable disabled={loading} onPress={onClick}>
    <Container bgColor={bgColor}>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

export default AuthButton;
