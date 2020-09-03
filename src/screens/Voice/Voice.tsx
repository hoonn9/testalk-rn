import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
// @ts-ignore
import TwilioVoice from 'react-native-twilio-programmable-voice';
import axios from 'axios';
import {useLogOut} from '../../AuthContext';
import Modal from 'react-native-modal';
import ModalAlert from '../../components/ModalAlert';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import getEnvVars from '../../enviroments';
import AsyncStorage from '@react-native-community/async-storage';

const Container = styled.View``;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const VoiceRowTouchable = styled.TouchableOpacity`
  padding: 16px 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  margin: 8px 16px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const VoiceRowText = styled.Text`
  font-size: 16px;
`;
const VoiceCategoryText = styled.Text`
  font-size: 15px;
  padding: 16px;
`;

interface IProp {}

const Voice: React.FunctionComponent<IProp> = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(
    false,
  );
  const [initialized, setInitialized] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('jwt');
      try {
        const accessToken = await axios
          .get(getEnvVars().apiUrl + 'accessToken', {headers: {'X-JWT': token}})
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        const success = await TwilioVoice.initWithToken(accessToken);
        setInitialized(success.initialized);
        console.log(success);
      } catch (error) {
        console.log(error);
      }

      TwilioVoice.addEventListener('deviceReady', function() {
        console.log('check');
      });
    };

    check(PERMISSIONS.ANDROID.RECORD_AUDIO)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            init();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const call = async () => {
    if (initialized) {
      const data = await TwilioVoice.connect({To: '+1047059935'});
      console.log(data);
    }
  };

  return (
    <>
      <Container>
        <>
          <VoiceCategoryText>일반</VoiceCategoryText>
          <VoiceRowTouchable activeOpacity={0.8} onPress={() => call()}>
            <VoiceRowText>통화</VoiceRowText>
          </VoiceRowTouchable>
        </>
      </Container>
      <Modal
        isVisible={isLogoutModalVisible}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}>
        <ModalSelector
          description={'로그아웃 하시겠어요?'}
          confirmEvent={() => null}
          confirmTitle="네"
          cancelEvent={() => setIsLogoutModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default Voice;
