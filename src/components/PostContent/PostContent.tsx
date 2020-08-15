import React from 'react';
import styled from 'styled-components/native';
import PeoplePhoto from '../PeoplePhoto';
import {dateSimpleConverter} from '../../utils';

const Container = styled.View`
  background-color: ${(props: any) => props.theme.whiteColor};
`;
const Wrapper = styled.View`
  padding: 0px 8px;
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 8px;
`;
const PeopleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 8px;
`;
const ContentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
const Touchable = styled.TouchableOpacity``;
const TitleText = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${(props: any) => props.theme.blackColor};
  padding: 8px;
`;
const ContentText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${(props: any) => props.theme.blackColor};
  padding: 8px;
  margin: 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
interface TextProp {
  gender: string;
}
const PeopleText = styled.Text<TextProp>`
  flex: 1;
  font-size: 15px;
  color: ${(props: any) => (props.gender === 'male' ? 'blue' : 'red')};
`;
const Text = styled.Text``;
interface IProp {
  id: number;
  userId: number;
  gender: string;
  title: string;
  content: string;
  updatedAt: string;
}

const PostContent: React.FunctionComponent<IProp> = ({
  id,
  userId,
  gender,
  title,
  content,
  updatedAt,
}) => {
  return (
    <Container>
      <TitleWrapper>
        <TitleText>
          {title}dddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        </TitleText>
      </TitleWrapper>
      <PeopleWrapper>
        <PeoplePhoto gender={gender} size={50} />
        <Wrapper>
          <PeopleText gender={gender}>글쓴이</PeopleText>
          <Text>{dateSimpleConverter(updatedAt)}</Text>
        </Wrapper>
      </PeopleWrapper>
      <ContentWrapper>
        <ContentText>{content}</ContentText>
      </ContentWrapper>
    </Container>
  );
};

export default PostContent;
