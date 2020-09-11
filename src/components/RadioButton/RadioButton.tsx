import React from 'react';
import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';

const Container = styled.View`
    width: 100%;
`;
const Title = styled.Text``;
const Text = styled.Text`
    text-align: center;
    font-size: 16px;
    color: ${(props: any) => props.theme.blackColor};
`;
const Wrapper = styled.View`
    flex-direction: row;
    margin: 16px 16px;
    border-radius: 32px;
    border-color: ${(props: any) => props.theme.lightGreyColor};
    border-width: 1px;
`;
interface TouchableViewProp {
    len: number;
}
const Touchable = styled.TouchableOpacity<TouchableViewProp>`
    width: ${(props: any) => `${100 / props.len}%`};
    padding: 8px;
    border-radius: 32px;
    justify-content: center;
    align-items: center;
`;

const ActiveTouchable = styled.TouchableOpacity<TouchableViewProp>`
    width: ${(props: any) => `${100 / props.len}%`};
    background-color: ${(props: any) => props.theme.lightGreyColor};
    padding: 8px;
    border-radius: 32px;
    justify-content: center;
    align-items: center;
`;

interface ButtonProp {
    name: string;
    value: any;
}

interface IProp extends TextInputProps {
    title?: string;
    buttons: Array<ButtonProp>;
    value: any;
    setValue: Function;
}

const RadioButton: React.FunctionComponent<IProp> = ({ title, buttons, value, setValue }) => {
    const onChangeUseState = (e: string) => {
        if (value !== e) {
            setValue(e);
        }
    };

    return (
        <Container>
            {title ? <Title>{title}</Title> : null}
            <Wrapper>
                {buttons.map((e, i) => {
                    if (e.value === value) {
                        return (
                            <ActiveTouchable
                                activeOpacity={0.5}
                                len={buttons.length}
                                key={i}
                                onPress={() => onChangeUseState.bind(null)(e.value)}>
                                <Text>{e.name}</Text>
                            </ActiveTouchable>
                        );
                    } else {
                        return (
                            <Touchable
                                activeOpacity={0.5}
                                len={buttons.length}
                                key={i}
                                onPress={() => onChangeUseState.bind(null)(e.value)}>
                                <Text>{e.name}</Text>
                            </Touchable>
                        );
                    }
                })}
            </Wrapper>
        </Container>
    );
};

export default RadioButton;
