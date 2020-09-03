import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../styles';
import {GestureResponderEvent} from 'react-native';

interface ContainerProp {
  height: number;
}

const Container = styled.View<ContainerProp>`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const Wrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 37px;
`;
const Divider = styled.View`
  justify-content: center;
  height: 100%;
`;
interface TouchableProp {
  currentTab: TabProp;
}
const VoiceTouchable = styled.TouchableOpacity`
  position: absolute;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 8px;
  right: 8px;
`;
const LeftTouchable = styled.TouchableOpacity<TouchableProp>`
  width: 20%;
  background-color: ${(props: any) =>
    props.currentTab === 'people'
      ? props.theme.backPrimaryColor
      : props.theme.whiteColor};
  border-top-left-radius: 1000px;
  border-bottom-left-radius: 1000px;
  padding-left: 8px;
  border: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const RightTouchable = styled.TouchableOpacity<TouchableProp>`
  width: 20%;
  background-color: ${(props: any) =>
    props.currentTab === 'post'
      ? props.theme.backPrimaryColor
      : props.theme.whiteColor};
  border-top-right-radius: 1000px;
  border-bottom-right-radius: 1000px;
  align-items: flex-end;
  padding-right: 8px;
  border: 1px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const Text = styled.Text``;
export type TabProp = 'people' | 'post';

interface IProp {
  currentTab: TabProp;
  setCurrentTab: Function;
  headerHeight: number;
  voiceOnPress: ((event: GestureResponderEvent) => void) | undefined;
}

const HeaderTab: React.FunctionComponent<IProp> = ({
  currentTab,
  setCurrentTab,
  headerHeight,
  voiceOnPress,
}) => {
  const [tabState, setTabState] = useState<TabProp>(currentTab);

  return (
    <Container height={headerHeight}>
      <Wrapper>
        <LeftTouchable
          activeOpacity={0.5}
          currentTab={tabState}
          onPress={() => {
            setCurrentTab('people');
            setTabState('people');
          }}>
          <Divider>
            <Ionicons
              name={
                tabState === 'people'
                  ? 'md-people-circle'
                  : 'md-people-circle-outline'
              }
              color={styles.blackColor}
              size={25}
            />
          </Divider>
        </LeftTouchable>

        <RightTouchable
          activeOpacity={0.5}
          currentTab={tabState}
          onPress={() => {
            setCurrentTab('post');
            setTabState('post');
          }}>
          <Divider>
            <Ionicons
              name={
                tabState === 'post'
                  ? 'md-navigate-circle'
                  : 'md-navigate-circle-outline'
              }
              color={styles.blackColor}
              size={25}
            />
          </Divider>
        </RightTouchable>
        <VoiceTouchable onPress={voiceOnPress}>
          <Ionicons name="call" color={styles.blackColor} size={25} />
        </VoiceTouchable>
      </Wrapper>
    </Container>
  );
};

export default HeaderTab;
