import React, {useEffect, useState, createRef, useLayoutEffect} from 'react';
import {TouchableWithoutFeedback, Keyboard, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {
  useMutation,
  useSubscription,
  useLazyQuery,
  useQuery,
} from '@apollo/react-hooks';
import {useNavigation, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {
  HeaderButtons,
  HeaderButton,
  HiddenItem,
  OverflowMenu,
  Item,
} from 'react-navigation-header-buttons';
import Modal from 'react-native-modal';
import SendMessage from '../../components/SendMessage';
import useInput from '../../hooks/useInput';
import MessageRow from '../../components/MessageRow';
import {toast} from '../../tools';
import {
  SUBSCRIBE_MESSAGE,
  SEND_MESSAGE,
  LEAVE_CHAT,
  GET_CHAT_USER,
} from './Message.queries';
import {
  SendChatMessage,
  SendChatMessageVariables,
  MessageSubscription,
  LeaveChat,
  LeaveChatVariables,
  GetChatUser,
  GetChatUserVariables,
} from '../../types/api';
import {
  getChatLogs,
  addMessage,
  addFriend,
  ChatLogRowProp,
  getUserInfoFromId,
  UserInfoProp,
  removeChat,
} from '../../dbTools';
import {GET_USER_PROFILE} from '../../sharedQueries.queries';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';
import {GET_MY_CHAT} from '../Chat/Chat.queries';
import ModalAlert from '../../components/ModalAlert';

const Container = styled.View`
  flex: 1;
`;
const Wrapper = styled.View`
  margin-bottom: 50px;
  flex: 1;
`;
const SenderWrapper = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
`;
const View = styled.View`
  flex: 1;
`;
const Text = styled.Text``;
const DateSeparaterWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
const DateSeparaterText = styled.Text`
  font-size: 15px;
`;
const Button = styled.Button``;

type MessageNaviProp = {
  Message: {
    userId: number;
    userInfo: {
      nickName: string;
      birth: number;
      gender: string;
      intro: string;
      profilePhoto: string;
    };
  };
};

type ProfileScreenRouteProp = RouteProp<MessageNaviProp, 'Message'>;

interface IProp {
  route: ProfileScreenRouteProp;
}

// define IconComponent, color, sizes and OverflowIcon in one place
const MaterialHeaderButton = (props: any) => (
  <HeaderButton iconSize={23} color="blue" {...props} />
);

const Message: React.FunctionComponent<IProp> = ({route}) => {
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  const modalConfirmEvent = async () => {
    try {
      if (chatId) {
        const {data} = await leaveChatMutation({
          variables: {
            id: chatId,
          },
        });
        if (data && data.LeaveChat) {
          if (data.LeaveChat.ok) {
            setModalVisible(!isModalVisible);
          }
        }
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const leaveModalConfirmEvent = () => {
    navigation.navigate('TabNavigation');
  };

  // 헤더 버튼 생성
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <MessageHeaderButton />,
    });
  }, [navigation]);

  const MessageHeaderButton = () => {
    return (
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <OverflowMenu
          OverflowIcon={<Icon name="chat-processing" size={23} color="blue" />}>
          <HiddenItem title="hidden1" onPress={() => console.log(route)} />
          <HiddenItem title="hidden2" onPress={() => setModalVisible(true)} />
        </OverflowMenu>
      </HeaderButtons>
    );
  };

  const {userId, userInfo: receiveUserInfo} = route.params;
  const [myId, setMyId] = useState<number | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const messageContent = useInput('');
  const [flatRef, setFlatRef] = useState<any>(() => createRef());
  const [messageList, setMessageList] = useState<Array<ChatLogRowProp>>([]);
  const MESSAGES_LIMIT: number = 10;
  const [offset, setOffset] = useState<number>(10);
  const [selectCount, setSelectCount] = useState<number>(0);
  const [compareDate, setCompareDate] = useState<string>('');
  const [dateSeparater, setDateSeparater] = useState<{[key: string]: string}>(
    {},
  );
  const [userInfo, setUserInfo] = useState<UserInfoProp>();

  const [
    getChatUser,
    {
      data: getChatUserData,
      loading: getChatUserLoading,
      error: getChatUserError,
    },
  ] = useLazyQuery<GetChatUser, GetChatUserVariables>(GET_CHAT_USER, {
    fetchPolicy: 'network-only',
  });

  const {data: subscribeData, loading: subscribeLoading} = useSubscription<
    MessageSubscription
  >(SUBSCRIBE_MESSAGE);

  const [leaveChatMutation] = useMutation<LeaveChat, LeaveChatVariables>(
    LEAVE_CHAT,
  );

  const onEndReached = async () => {
    if (chatId) {
      const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT, offset);
      if (chatLogs) {
        setMessageList([...messageList, ...chatLogs.array]);
        setOffset(offset + MESSAGES_LIMIT);
        setSelectCount(selectCount + 1);
      }
    }
  };

  const [sendMessageMutation] = useMutation<
    SendChatMessage,
    SendChatMessageVariables
  >(SEND_MESSAGE);

  const genDateSeparater = (messages: Array<ChatLogRowProp>) => {
    let tempDate = compareDate;
    for (let i = 0; i < messages.length; i++) {
      const createdAt = new Date(messages[i].created_at);
      const date = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDate()}`;
      //console.log(i, date);
      if (date !== tempDate) {
        //console.log('cp', tempDate, 'd', date);

        setDateSeparater(
          Object.assign({}, dateSeparater, {
            [messages[i]._id]: tempDate,
          }),
        );
        tempDate = date;
      }
    }
    setCompareDate(tempDate);
  };
  useEffect(() => {
    //console.log(messageList.length);
    if (messageList.length > 0) {
      genDateSeparater(
        messageList.slice(selectCount * MESSAGES_LIMIT, undefined),
      );
    }
    //console.log(dateSeparater);
  }, [messageList]);

  useEffect(() => {
    const initChat = async () => {
      const getMyId = await AsyncStorage.getItem('userId');

      if (getMyId) {
        setMyId(parseInt(getMyId));
      } else {
        setMyId(null);
        toast('잘못된 접근 입니다.');
      }
      console.log('userId :', userId);
      const getUserInfo = await getUserInfoFromId(userId);
      console.log('userInfo', getUserInfo);
      // 유저 정보 DB에 있을 경우
      if (getUserInfo) {
        const chatId = getUserInfo.chat_id;
        setChatId(chatId);
        setUserInfo(getUserInfo);
        if (chatId) {
          await getChatUser({
            variables: {
              id: chatId,
            },
          });

          // Date separater
          const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT);
          if (chatLogs) {
            if (chatLogs.array.length > 0) {
              // 비교할 날짜
              const initDate = new Date(chatLogs.array[0].created_at);
              setCompareDate(
                `${initDate.getFullYear()}-${initDate.getMonth()}-${initDate.getDate()}`,
              );

              const messages = [...chatLogs.array];
              setMessageList(messages);
              return messages;
            } else {
              return null;
            }
          }
        }
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (subscribeData) {
      if (subscribeData.MessageSubscription) {
        const {
          id,
          chatId,
          userId,
          text,
          createdAt,
        } = subscribeData.MessageSubscription;
        if (chatId && userId) {
          setMessageList([
            {
              _id: messageList.length,
              id: id,
              chat_id: chatId,
              user_id: userId,
              content: text,
              created_at: parseInt(createdAt),
            },
            ...messageList,
          ]);
          // 수신 시 최하단으로 스크롤
          if (flatRef && messageList.length > 0) {
            flatRef.scrollToIndex({index: 0});
          }
        } else {
          toast('데이터 수신 중 오류가 발생하였습니다.');
        }
      }
    }
  }, [subscribeData]);

  const senderOnSubmit = async () => {
    if (messageContent.value && myId) {
      try {
        const {data} = await sendMessageMutation({
          variables: {
            chatId,
            receiveUserId: userId,
            text: messageContent.value,
          },
        });
        console.log(data);

        if (data && data.SendChatMessage.ok && data.SendChatMessage.message) {
          const {
            id,
            chatId: sendedChatId,
            userId: sendedUserId,
            text: content,
            createdAt,
          } = data.SendChatMessage.message;
          if (sendedChatId) {
            addMessage(
              sendedChatId,
              id,
              sendedUserId || myId,
              userId,
              content,
              parseInt(createdAt),
            );
            if (userInfo) {
              addFriend({
                userId,
                chatId: sendedChatId,
                nickName: userInfo.nick_name,
                birth: userInfo.birth,
                gender: userInfo.gender,
                intro: userInfo.intro,
                profilePhoto: userInfo.profile_photo,
              });
            } else {
              if (receiveUserInfo) {
                addFriend({
                  userId,
                  chatId: sendedChatId,
                  nickName: receiveUserInfo.nickName,
                  birth: receiveUserInfo.birth,
                  gender: receiveUserInfo.gender,
                  intro: receiveUserInfo.intro,
                  profilePhoto: receiveUserInfo.profilePhoto,
                });
              } else {
                toast('상대를 저장하는데 실패했어요.');
              }
            }
            // 채팅방 처음 생성 되었을 때
            if (!chatId) {
              //await setInitMessages({ variables: { id: sendedChatId } });
            }
            setChatId(sendedChatId);
            messageContent.setValue('');
          }
        } else {
          toast('문제가 생겨 메시지를 보낼 수 없어요.');
        }
      } catch (error) {
        toast('문제가 생겨 메시지를 보낼 수 없어요.');
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log(getChatUserData, getChatUserLoading, getChatUserError);
    if (chatId && getChatUserData && getChatUserData.GetChatUser) {
      console.log(getChatUserData);
      if (getChatUserData.GetChatUser.ok) {
        if (getChatUserData.GetChatUser.user) {
          const {
            id,
            nickName,
            birth,
            gender,
            intro,
            profilePhoto,
          } = getChatUserData.GetChatUser.user;
          // TODO
          // 유저 정보 업데이트
          addFriend({
            userId: id,
            chatId,
            nickName,
            birth: parseInt(birth),
            gender,
            intro,
            profilePhoto: profilePhoto ? profilePhoto[0].url : null,
          });
        } else {
          // 상대가 떠났을 때
          removeChat(userId, chatId);
          setIsLeaveModalVisible(true);
        }
      } else {
        // 에러 처리
        // 로컬 DB에서 제거
        toast('잘못된 접근입니다.');
        setIsLeaveModalVisible(true);
      }
    }
  }, [getChatUserData, getChatUserLoading, getChatUserError]);

  const separaterDateConverter = (date: string) => {
    const temp = date.split('-');
    return `${temp[0]}년 ${parseInt(temp[1]) + 1}월 ${temp[2]}일`;
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Wrapper>
            <FlatList
              ref={ref => setFlatRef(ref)}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.01}
              data={messageList}
              keyExtractor={(e, i) => i.toString()}
              renderItem={data => {
                if (data.item.id) {
                  return (
                    <>
                      {Object.keys(dateSeparater).includes(
                        data.item._id.toString(),
                      ) ? (
                        <DateSeparaterWrapper>
                          <DateSeparaterText>
                            {separaterDateConverter(
                              dateSeparater[data.item._id.toString()],
                            )}
                          </DateSeparaterText>
                        </DateSeparaterWrapper>
                      ) : null}
                      <MessageRow
                        id={data.item.id.toString()}
                        message={data.item.content}
                        createdAt={data.item.created_at}
                        mine={data.item.user_id === myId ? true : false}
                      />
                    </>
                  );
                } else {
                  return null;
                }
              }}
              inverted
            />
          </Wrapper>
          <SenderWrapper>
            <SendMessage
              value={messageContent.value}
              onChangeText={messageContent.onChange}
              onPress={senderOnSubmit}
            />
          </SenderWrapper>
        </Container>
      </TouchableWithoutFeedback>
      <Modal
        isVisible={isModalVisible}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}
        swipeDirection={['down']}
        onSwipeComplete={() => setModalVisible(!isModalVisible)}>
        <ModalSelector
          description="대화를 끝내시겠습니까?"
          confirmEvent={modalConfirmEvent}
          confirmTitle="나가기"
          cancelEvent={() => setModalVisible(!isModalVisible)}
        />
      </Modal>
      <Modal
        isVisible={isLeaveModalVisible}
        animationOut="fadeOutDown"
        backdropColor={styles.modalBackDropColor}
        backdropOpacity={0.3}
        backdropTransitionOutTiming={0}>
        <ModalAlert
          description="상대방이 대화를 종료했습니다."
          confirmEvent={leaveModalConfirmEvent}
          confirmTitle="확인"
        />
      </Modal>
    </>
  );
};

export default Message;
