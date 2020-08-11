import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
const View = styled.View`
  margin: 8px;
`;
const Text = styled.Text``;

interface IProp {
  text: string;
}

const EmptyScreen: React.FunctionComponent<IProp> = ({text}) => {
  return (
    <Container>
      <Wrapper>
        <View>
          <Icon name="sad-cry" size={62} />
        </View>
        <View>
          <Text>{text}</Text>
        </View>
      </Wrapper>
    </Container>
  );
};

export default EmptyScreen;
