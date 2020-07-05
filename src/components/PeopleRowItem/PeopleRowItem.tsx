import React from "react";
import styled from "styled-components/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { getAge, dateSimpleConverter } from "../../utils";

const Container = styled.View`
  flex-direction: row;
`;
const Wrapper = styled.View`
  justify-content: center;
  background-color: #ddd;
  padding: 1px 0px;
`;
const ImageWrapper = styled.View`
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
const FirstText = styled.Text`
  font-size: 16px;
`;
const SecondText = styled.Text`
  font-size: 15px;
  color: ${(props: any) => props.theme.darkGreyColor};
`;
const ThirdText = styled.Text`
  font-size: 13px;
`;

const styles = (gender?: string) =>
  StyleSheet.create({
    image: {
      width: 50,
      height: 50,
      borderRadius: 50 / 2,
      borderColor: gender === "male" ? "#3897f0" : "#ED4956",
      borderWidth: 1,
    },
  });

interface IProp {
  id: string | undefined;
  nickName: string | undefined;
  birth: string | undefined;
  gender: string | undefined;
  intro: string | undefined;
  updatedAt: string | undefined | null;
  lastLat: number | undefined | null;
  lastLng: number | undefined | null;
  getDistance: Function;
  onSelected: Function;
}

const PeopleRowItem: React.FunctionComponent<IProp> = ({
  id,
  intro,
  nickName,
  birth,
  gender,
  updatedAt,
  lastLat,
  lastLng,
  getDistance,
  onSelected = () => null,
}) => {
  return (
    <Container>
      <ImageWrapper>
        <Image
          source={{ uri: "https://i.stack.imgur.com/l60Hf.png" }}
          style={gender ? styles(gender).image : styles().image}
        />
      </ImageWrapper>
      <Touchable onPress={() => onSelected(id)}>
        <InfoWrapper>
          <Wrapper>
            <FirstText>{intro ? intro : "안녕하세요. 반갑습니다"}</FirstText>
          </Wrapper>
          <Wrapper>
            <SecondText>
              {nickName} {birth ? getAge(birth) : "??"} {gender}
            </SecondText>
          </Wrapper>
          <Wrapper>
            <ThirdText>
              {`${getDistance(lastLat, lastLng)} km `}
              {updatedAt ? dateSimpleConverter(updatedAt) : "??"}
            </ThirdText>
          </Wrapper>
        </InfoWrapper>
      </Touchable>
    </Container>
  );
};

export default React.memo(PeopleRowItem);
