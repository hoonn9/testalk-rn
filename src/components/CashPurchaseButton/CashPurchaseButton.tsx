import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import constants from '../../constants';
import {numberWithCommas} from '../../utils';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 1px;
  margin: 8px;
`;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text`
  font-size: 18px;
`;
const Touchable = styled.TouchableOpacity`
  flex: 1;
`;

interface IProp {
  price: number;
  unit: number;
}

const CashPurchaseButton: React.FunctionComponent<IProp> = ({price, unit}) => {
  return (
    <Container>
      <Touchable activeOpacity={0.5}>
        <Text>{`₩ ${numberWithCommas(price)}`}</Text>
        <Wrapper>
          <Icon name="dollar" size={21} style={{margin: 8}} />
          <Text>{unit}</Text>
        </Wrapper>
      </Touchable>
    </Container>
  );
};

export default CashPurchaseButton;
