import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const Wrapper = styled.View``;

interface IProp {
  uri?: string | undefined;
  size?: number;
  gender: string;
}

interface StyleProp {
  size: number;
}

const styles = (props: StyleProp) =>
  StyleSheet.create({
    image: {
      width: props.size,
      height: props.size,
      borderRadius: (props.size - props.size / 10) / 2,
      borderWidth: 1,
    },
  });

const PeoplePhoto: React.FunctionComponent<IProp> = ({
  uri,
  gender,
  size = 58,
}) => {
  return (
    <Wrapper>
      {uri ? (
        <FastImage source={{uri}} style={styles({size}).image} />
      ) : gender === 'male' ? (
        <FastImage
          source={require('../../../images/male.png')}
          style={styles({size}).image}
        />
      ) : (
        <FastImage
          source={require('../../../images/female.png')}
          style={styles({size}).image}
        />
      )}
    </Wrapper>
  );
};

export default PeoplePhoto;
