import React, {useEffect, useState, createRef} from 'react';
import {TouchableWithoutFeedback, Keyboard, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {useMutation, useSubscription} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigation} from 'react-navigation';
import SendMessage from '../../components/SendMessage';
import useInput from '../../hooks/useInput';
import MessageRow from '../../components/MessageRow';
import {toast} from '../../tools';
import {SUBSCRIBE_MESSAGE, SEND_MESSAGE} from './Message.queries';
import {
  SendChatMessage,
  SendChatMessageVariables,
  MessageSubscription,
} from '../../types/api';
import {
  setItemChatRooms,
  getChatLogs,
  addMessage,
  addFriends,
  getFriends,
  ChatLogRowProp,
  getUserInfoFromId,
  UserInfoProp,
} from '../../dbTools';

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

interface IProp extends NavigationStackScreenProps {}

const Message: React.FunctionComponent<IProp> = ({navigation}) => {
  const [myId, setMyId] = useState<number | null>(null);
  const userId = navigation.getParam('userId');
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
  const [userInfo, setUserInfo] = useState<UserInfoProp | null>(null);

  const {data: subscribeData, loading: subscribeLoading} = useSubscription<
    MessageSubscription
  >(SUBSCRIBE_MESSAGE);

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
      console.log(i, date);
      if (date !== tempDate) {
        console.log('cp', tempDate, 'd', date);

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
    console.log(messageList.length);
    if (messageList.length > 0) {
      genDateSeparater(
        messageList.slice(selectCount * MESSAGES_LIMIT, undefined),
      );
    }
    console.log(dateSeparater);
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
          const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT);

          if (chatLogs) {
            if (chatLogs.array.length > 0) {
              // Date sparater 비교할 날짜 초기화
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
            receiveUserId: parseInt(userId),
            text: messageContent.value,
          },
        });

        if (data && data.SendChatMessage.ok && data.SendChatMessage.message) {
          const {
            id,
            chatId: sendedChatId,
            userId: sendedUserId,
            text: content,
            createdAt,
          } = data.SendChatMessage.message;
          if (sendedChatId) {
            setItemChatRooms(
              userId,
              sendedChatId,
              messageContent.value,
              createdAt,
            );
            addMessage(
              sendedChatId,
              id,
              sendedUserId || myId,
              userId,
              content,
              createdAt,
            );
            if (userInfo) {
              addFriends(
                userId,
                sendedChatId,
                userInfo.nick_name,
                parseInt(userInfo.birth),
                userInfo.gender,
                userInfo.intro,
                userInfo.profile_photo,
              );
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

  const separaterDateConverter = (date: string) => {
    const temp = date.split('-');
    return `${temp[0]}년 ${parseInt(temp[1]) + 1}월 ${temp[2]}일`;
  };

  return (
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
  );
};

export default withNavigation(Message);
