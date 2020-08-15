import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet, GestureResponderEvent} from 'react-native';
import {getAge, dateSimpleConverter} from '../../utils';
import PeoplePhoto from '../PeoplePhoto';

const Container = styled.View`
  flex-direction: row;
`;
const Wrapper = styled.View`
  justify-content: center;
  background-color: #ddd;
  padding: 4px 8px;
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const ImageTouchable = styled.TouchableOpacity`
  justify-content: center;
  background-color: #ddd;
  padding: 0px 8px;
`;
const InfoWrapper = styled.View``;
const Touchable = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  background-color: #ddd;
`;
interface TextProp {
  gender: string;
}
const FirstText = styled.Text<TextProp>`
  font-size: 14px;
  color: ${(props: any) => (props.gender === 'male' ? 'blue' : 'red')};
`;
const SecondText = styled.Text`
  font-size: 15px;
`;
const ThirdText = styled.Text`
  font-size: 13px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;

interface IProp {
  id: number;
  userId: number;
  gender: string;
  content: string;
  updatedAt: string;
}

const CommentRow: React.FunctionComponent<IProp> = ({
  id,
  userId,
  gender,
  content,
  updatedAt,
}) => {
  return (
    <Container>
      <Touchable activeOpacity={1}>
        <InfoWrapper>
          <Wrapper>
            <FirstText gender={gender}>댓쓴이</FirstText>
          </Wrapper>
          <Wrapper>
            <SecondText>{content}</SecondText>
          </Wrapper>
          <Wrapper>
            <ThirdText>{dateSimpleConverter(updatedAt)}</ThirdText>
          </Wrapper>
        </InfoWrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(CommentRow);
