import React, {useState} from 'react';
import styled from 'styled-components/native';
import {TextInputProps, TouchableOpacityProps} from 'react-native';
import constants from '../../constants';
import {useMutation} from '@apollo/react-hooks';
import {TOGGLE_USER_LIKE} from '../../screens/Tabs/Profile.queries';
import Icon from 'react-native-vector-icons/Ionicons';
import {ToggleUserLike, ToggleUserLikeVariables} from '../../types/api';

const Container = styled.View``;
const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Text = styled.Text``;
interface TouchableViewProp {
  len: number;
}
const TouchableView = styled.View<TouchableViewProp>`
  width: ${(props: any) => `${constants.width / props.len}px`};
`;
const Touchable = styled.TouchableOpacity``;
interface IProp extends TextInputProps {
  id: number;
  isLiked: boolean;
  likeCount: number;
}

const UserLikeButton: React.FunctionComponent<IProp> = ({
  id,
  isLiked,
  likeCount,
}) => {
  const [toggleUserLikeMutation] = useMutation<
    ToggleUserLike,
    ToggleUserLikeVariables
  >(TOGGLE_USER_LIKE, {
    variables: {id},
  });
  const [isLikeState, setIsLikeState] = useState<boolean>(isLiked);
  const [likeCountState, setLikeCountState] = useState<number>(likeCount);
  return (
    <Container>
      <Wrapper>
        <Touchable
          onPress={() => {
            isLikeState
              ? setLikeCountState(likeCountState - 1)
              : setLikeCountState(likeCountState + 1);
            setIsLikeState(!isLikeState);
            toggleUserLikeMutation();
          }}>
          {isLikeState ? (
            <Icon name="heart-sharp" size={26} />
          ) : (
            <Icon name="heart-outline" size={26} />
          )}
        </Touchable>
        <Text>{likeCountState}</Text>
      </Wrapper>
    </Container>
  );
};

export default UserLikeButton;
