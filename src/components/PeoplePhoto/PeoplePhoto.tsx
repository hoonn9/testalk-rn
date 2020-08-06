import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const Wrapper = styled.View``;

interface IProp {
  uri: string | undefined;
  gender: string;
}

const styles = () =>
  StyleSheet.create({
    image: {
      width: 65,
      height: 65,
      borderRadius: 50 / 2,
      borderWidth: 1,
    },
  });

const PeoplePhoto: React.FunctionComponent<IProp> = ({uri, gender}) => {
  return (
    <Wrapper>
      {uri ? (
        <FastImage source={{uri}} style={styles().image} />
      ) : gender === 'male' ? (
        <FastImage
          source={require('../../../images/male.png')}
          style={styles().image}
        />
      ) : (
        <FastImage
          source={require('../../../images/female.png')}
          style={styles().image}
        />
      )}
    </Wrapper>
  );
};

export default PeoplePhoto;
