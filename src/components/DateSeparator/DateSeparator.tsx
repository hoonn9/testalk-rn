import React from 'react';
import styled from 'styled-components/native';
import {dateConverter} from '../../utils';

const Container = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;
const Text = styled.Text`
  font-size: 15px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;

interface IProp {
  timestamp: number;
}

const DateSeparator: React.FunctionComponent<IProp> = ({timestamp}) => {
  return (
    <Container>
      <Text>{dateConverter(timestamp)}</Text>
    </Container>
  );
};

export default DateSeparator;
