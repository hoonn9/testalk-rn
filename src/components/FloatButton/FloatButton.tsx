import React from 'react';
import styled from 'styled-components/native';
import { GestureResponderEvent } from 'react-native';

interface TouchableProp {
    size: number;
}
const Touchable = styled.TouchableOpacity<TouchableProp>`
    width: ${(props: any) => `${props.size}px`};
    height: ${(props: any) => `${props.size}px`};
    border-radius: ${`${80 / 2}px`};
    border-radius: 100px;
    background-color: ${(props: any) => props.theme.darkGreyColor};
    justify-content: center;
    align-items: center;
`;

interface IProp {
    onPress: ((event: GestureResponderEvent) => void) | undefined;
    size?: number;
    icon: any;
}

const FloatButton: React.FunctionComponent<IProp> = ({ onPress, size = 80, icon }) => {
    return (
        <Touchable size={size} activeOpacity={0.7} onPress={onPress}>
            {icon}
        </Touchable>
    );
};

export default FloatButton;
