import React, { useEffect, useState, createRef } from "react";
import styled from "styled-components/native";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { SUBSCRIBE_MESSAGE, SEND_MESSAGE } from "./Message.queries";
import {
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import SendMessage from "../../components/SendMessage";
import useInput from "../../hooks/useInput";
import { withNavigation } from "react-navigation";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { toast } from "../../tools";
import {
  SendChatMessage,
  SendChatMessageVariables,
  MessageSubscription,
} from "../../types/api";
import MessageRow from "../../components/MessageRow";
import { setItemChatRooms, getChatLogs, addMessage } from "../../dbTools";
import { GET_LOCAL_CHAT_MESSAGES } from "../../sharedQueries.local";
import { ChatLogRowProp } from "../../dbTools";

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

interface IProp extends NavigationStackScreenProps {}

const Message: React.FunctionComponent<IProp> = ({ navigation }) => {
  const [myId, setMyId] = useState<number | null>(null);
  const receiveUserId = navigation.getParam("receiveUserId");
  const [chatId, setChatId] = useState(navigation.getParam("chatId", null));
  const messageContent = useInput("");
  const [flatRef, setFlatRef] = useState<any>(() => createRef());
  const [messageList, setMessageList] = useState<Array<ChatLogRowProp>>([]);
  const MESSAGES_LIMIT: number = 10;
  const [offset, setOffset] = useState<number>(10);

  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [requestTime, setRequestTime] = useState<string>(
    navigation.getParam("requestTime", null)
  );

  const { data: subscribeData, loading: subscribeLoading } = useSubscription<
    MessageSubscription
  >(SUBSCRIBE_MESSAGE);

  const onEndReached = async () => {
    const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT, offset);
    if (chatLogs) {
      setMessageList([...messageList, ...chatLogs._array]);
      setOffset(offset + MESSAGES_LIMIT);
    }
  };

  const [sendMessageMutation] = useMutation<
    SendChatMessage,
    SendChatMessageVariables
  >(SEND_MESSAGE);

  useEffect(() => {
    const initChat = async () => {
      const getMyId = await AsyncStorage.getItem("userId");

      if (getMyId) {
        setMyId(parseInt(getMyId));
      } else {
        setMyId(null);
        toast("잘못된 접근 입니다.");
      }

      const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT);

      if (chatLogs) {
        setMessageList([...chatLogs._array]);
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
          if (flatRef) {
            flatRef.scrollToIndex({ index: 0 });
          }
        } else {
          toast("데이터 수신 중 오류가 발생하였습니다.");
        }
      }
    }
  }, [subscribeData]);

  const senderOnSubmit = async () => {
    if (messageContent.value && myId) {
      console.log("Send to Chat Id : ", chatId);
      try {
        const { data } = await sendMessageMutation({
          variables: {
            chatId,
            receiveUserId: parseInt(receiveUserId),
            text: messageContent.value,
          },
        });
        //console.log(data);
        if (data) {
          if (data.SendChatMessage.ok) {
            if (data.SendChatMessage.message) {
              const {
                id,
                chatId: sendedChatId,
                userId,
                text: content,
                createdAt,
              } = data.SendChatMessage.message;
              if (sendedChatId) {
                console.log("변경 전 requestTime", requestTime);
                setItemChatRooms(
                  receiveUserId,
                  sendedChatId,
                  messageContent.value,
                  createdAt
                );
                addMessage(
                  chatId,
                  id,
                  userId || myId,
                  receiveUserId,
                  content,
                  createdAt
                );
                // 채팅방 처음 생성 되었을 때
                if (!chatId) {
                  //await setInitMessages({ variables: { id: sendedChatId } });
                }
                setChatId(sendedChatId);
              }
            }
          } else {
            toast("문제가 생겨 메시지를 보낼 수 없어요.");
          }
        } else {
          toast("문제가 생겨 메시지를 보낼 수 없어요.");
        }
      } catch (error) {
        toast("문제가 생겨 메시지를 보낼 수 없어요.");
        console.log(error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Wrapper>
          <FlatList
            ref={(ref) => setFlatRef(ref)}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.01}
            data={messageList}
            keyExtractor={(e, i) => i.toString()}
            renderItem={(data) => {
              if (data.item?.id) {
                // const ymd = formatYMD(data.item?.createdAt);
                // console.log(dateTrigger.find((element) => element === ymd));
                // if (!dateTrigger.find((element) => element === ymd)) {
                //   setDateTrigger([...dateTrigger, ymd]);
                return (
                  <>
                    <Text>{data.item.created_at}</Text>
                    <MessageRow
                      id={data.item.id.toString()}
                      message={data.item.content}
                      createdAt={data.item.created_at}
                      mine={data.item.user_id === myId ? true : false}
                    />
                  </>
                );
                //   } else {
                //     return (
                //       <>
                //         <MessageRow
                //           id={data.item.id.toString()}
                //           message={data.item.text}
                //           createdAt={data.item.createdAt}
                //           mine={data.item.userId === myId ? true : false}
                //         />
                //       </>
                //     );
                //   }
                // } else {
                //   return null;
                // }
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
