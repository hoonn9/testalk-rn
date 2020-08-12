import React from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator} from 'react-native';

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
`;

interface IProp {
  showing: boolean;
}

const Indicator: React.FunctionComponent<IProp> = ({showing}) => {
  return showing ? (
    <Wrapper>
      <ActivityIndicator size="large" />
    </Wrapper>
  ) : null;
};

export default Indicator;
