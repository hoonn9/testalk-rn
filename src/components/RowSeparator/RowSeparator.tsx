import React from "react";
import styled from "styled-components/native";

interface IProp {}

const View = styled.View`
  height: 0.5px;
  background-color: ${(props: any) => props.theme.lightGreyColor};
`;

const RowSeparator: React.FunctionComponent<IProp> = ({}) => {
  return <View />;
};

export default RowSeparator;
