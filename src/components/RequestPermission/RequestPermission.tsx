import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacityProps, GestureResponderEvent } from "react-native";

const Container = styled.View`
  align-items: center;
`;
const Text = styled.Text`
  font-size: 18px;
`;
const Touchable = styled.TouchableOpacity`
  padding: 12px 8px;
  margin: 6px;
  background-color: ${(props: any) => props.theme.blueColor};
`;
interface IProp extends TouchableOpacityProps {
  name: string;
  callback: ((event: GestureResponderEvent) => void) | undefined;
}

const UserProfile: React.FunctionComponent<IProp> = ({ callback, name }) => {
  return (
    <Container>
      <Text>{`${name} 권한에 허용하셔야 앱을 이용하실 수 있습니다.`}</Text>
      <Text>{`아래 버튼을 눌러 허용해주세요!`}</Text>
      <Touchable onPress={callback}>
        <Text>{"권한 허용"}</Text>
      </Touchable>
      <Text>{`이 방법으로 안될 시 설정 - 앱에 가셔서 수동으로 허용해주세요.`}</Text>
    </Container>
  );
};

export default UserProfile;
