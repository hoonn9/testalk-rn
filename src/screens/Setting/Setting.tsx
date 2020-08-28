import React, {useState} from 'react';
import styled from 'styled-components/native';
import {useLogOut} from '../../AuthContext';
import Modal from 'react-native-modal';
import ModalAlert from '../../components/ModalAlert';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';

const Container = styled.View``;
const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;
const SettingRowTouchable = styled.TouchableOpacity`
  padding: 16px 8px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  margin: 8px 16px;
  border-color: ${(props: any) => props.theme.darkGreyColor};
`;
const SettingRowText = styled.Text`
  font-size: 16px;
`;
const SettingCategoryText = styled.Text`
  font-size: 15px;
  padding: 16px;
`;

interface IProp {}

const Setting: React.FunctionComponent<IProp> = () => {
  const logout = useLogOut();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(
    false,
  );
  return (
    <>
      <Container>
        <SettingCategoryText>일반</SettingCategoryText>
        <SettingRowTouchable activeOpacity={0.8}>
          <SettingRowText>알림 설정</SettingRowText>
        </SettingRowTouchable>
        <SettingRowTouchable activeOpacity={0.8}>
          <SettingRowText>차단 설정</SettingRowText>
        </SettingRowTouchable>
        <SettingCategoryText>계정</SettingCategoryText>
        <SettingRowTouchable
          activeOpacity={0.8}
          onPress={() => setIsLogoutModalVisible(true)}>
          <SettingRowText>로그아웃</SettingRowText>
        </SettingRowTouchable>
        <SettingRowTouchable activeOpacity={0.8}>
          <SettingRowText>회원탈퇴</SettingRowText>
        </SettingRowTouchable>
        <SettingCategoryText>고객센터</SettingCategoryText>
        <SettingRowTouchable activeOpacity={0.8}>
          <SettingRowText>문의하기</SettingRowText>
        </SettingRowTouchable>
        <SettingCategoryText>앱</SettingCategoryText>
        <SettingRowTouchable activeOpacity={0.8}>
          <SettingRowText>버전</SettingRowText>
        </SettingRowTouchable>
      </Container>
      <Modal
        isVisible={isLogoutModalVisible}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}>
        <ModalSelector
          description={'로그아웃 하시겠어요?'}
          confirmEvent={() => logout()}
          confirmTitle="네"
          cancelEvent={() => setIsLogoutModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default Setting;
