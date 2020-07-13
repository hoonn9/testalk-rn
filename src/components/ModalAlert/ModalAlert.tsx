import React from 'react';
import styled from 'styled-components/native';
import {NativeSyntheticEvent, NativeTouchEvent, StyleSheet} from 'react-native';

const Container = styled.TouchableOpacity`
  flex: 1;
  justify-content: flex-end;
`;
const View = styled.View`
  width: 100%;
  background-color: ${(props: any) => props.theme.lightGreyColor};
`;
const Text = styled.Text`
  text-align: center;
  padding: 8px;
  font-weight: 700;
  font-size: 16px;
  color: ${(props: any) => props.theme.blackColor};
`;
const DescriptionText = styled.Text`
  text-align: center;
  padding: 32px 8px;
  font-size: 15px;
  color: ${(props: any) => props.theme.blackColor};
`;
const ButtonWrapper = styled.View`
  width: 100%;
  height: 120px;
`;
const Touchable = styled.TouchableOpacity`
  flex: 1;
  height: 60px;
  color: #000;
  justify-content: center;
`;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

interface ModalProp {
  description: string;
  confirmTitle: string;
  confirmEvent: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
}

const ModalAlert: React.FunctionComponent<ModalProp> = ({
  description,
  confirmTitle,
  confirmEvent,
}) => {
  return (
    <Container>
      <View>
        <DescriptionText>{description}</DescriptionText>
        <ButtonWrapper>
          <Touchable onPress={confirmEvent}>
            <Text>{confirmTitle}</Text>
          </Touchable>
        </ButtonWrapper>
      </View>
    </Container>
  );
};

export default ModalAlert;
