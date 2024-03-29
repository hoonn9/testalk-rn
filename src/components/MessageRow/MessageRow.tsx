import React from 'react';
import styled from 'styled-components/native';
import {dateMessageConverter} from '../../utils';
import DateSeparator from '../DateSeparator';

interface WrapperProp {
  mine: boolean;
}

const Container = styled.View``;
const ChatWrapper = styled.View<WrapperProp>`
  flex-direction: row;
  align-self: ${(props: any) => (props.mine ? 'flex-end' : 'flex-start')};
`;
const Wrapper = styled.View<WrapperProp>`
  background-color: ${(props: any) =>
    props.mine ? props.theme.blueColor : props.theme.greyColor};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  border-bottom-right-radius: ${(props: any) => (props.mine ? '0px' : '20px')};
  border-bottom-left-radius: ${(props: any) => (!props.mine ? '0px' : '20px')};
  margin-bottom: 10px;
  max-width: 70%;
`;
const DateWrapper = styled.View`
  justify-content: flex-end;
  margin: 0px 10px;
  margin-bottom: 10px;
`;
const Touchable = styled.TouchableOpacity``;
const Text = styled.Text``;

interface IProp {
  message: string;
  createdAt: number;
  mine: boolean;
  isDateSeparator: number;
}

const MessageRow: React.FunctionComponent<IProp> = ({
  message,
  mine,
  createdAt,
  isDateSeparator,
}) => {
  return (
    <Container>
      <Touchable activeOpacity={1}>
        {isDateSeparator ? <DateSeparator timestamp={createdAt} /> : null}
        {mine ? (
          <>
            <ChatWrapper mine={mine}>
              <DateWrapper>
                <Text>{dateMessageConverter(createdAt)}</Text>
              </DateWrapper>
              <Wrapper mine={mine}>
                <Text>{message}</Text>
              </Wrapper>
            </ChatWrapper>
          </>
        ) : (
          <>
            <ChatWrapper mine={mine}>
              <Wrapper mine={mine}>
                <Text>{message}</Text>
              </Wrapper>
              <DateWrapper>
                <Text>{dateMessageConverter(createdAt)}</Text>
              </DateWrapper>
            </ChatWrapper>
          </>
        )}
      </Touchable>
    </Container>
  );
};

export default React.memo(MessageRow);
