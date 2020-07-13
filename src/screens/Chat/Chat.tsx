import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';
import ChatRoomRow from '../../components/ChatRoomRow';
import {getChatRooms, ChatRoomProp} from '../../dbTools';
import {useQuery} from '@apollo/react-hooks';
import {GetMyChat, GetMyChat_GetMyChat_chat} from '../../types/api';
import {GET_MY_CHAT} from './Chat.queries';
import {useNavigation} from '@react-navigation/native';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const Text = styled.Text``;
const Touchable = styled.TouchableOpacity``;

interface IProp {}

const Chat: React.FunctionComponent<IProp> = () => {
  const navigation = useNavigation();
  const [chatRoom, setChatRoom] = useState<Array<ChatRoomProp> | null>(null);
  const {data, loading, error} = useQuery<GetMyChat>(GET_MY_CHAT, {
    fetchPolicy: 'network-only',
  });
  const getChatRoom = async () => {
    const getRoom = await getChatRooms();
    //console.log('getRooms:', getRoom);
    if (getRoom) {
      setChatRoom(getRoom.array);
    }
  };

  const setDifference = (a: Array<number>, b: Array<number | undefined>) => {
    console.log(a, b);
    const result = new Set(a);
    b.forEach((x: number | undefined) => {
      if (x) result.delete(x);
    });
    return result;
  };

  const checkValidateChat = (chats: Array<GetMyChat_GetMyChat_chat>) => {
    console.log(chats[0]);
    // 상대가 나간 채팅
    let leaveChat = [];
    let dbChats = [];
    let serverChats = [];
    if (chatRoom) {
      for (let i in chats) {
        if (chats[i].id) serverChats.push(chats[i].id);
      }

      for (let i in chatRoom) {
        dbChats.push(chatRoom[i].chat_id);
      }
      console.log(setDifference(dbChats, serverChats));
    }
  };

  const navigateChatRoom = useCallback((userId: number) => {
    navigation.navigate('MessageNavigation', {
      userId,
    });
  }, []);

  useEffect(() => {
    getChatRoom();
  }, []);

  useEffect(() => {
    if (data && data.GetMyChat && data.GetMyChat.ok) {
      if (data.GetMyChat.chat && data.GetMyChat.chat.length > 0) {
        const notNullData = [];
        for (let chat of data.GetMyChat.chat) {
          if (chat) notNullData.push(chat);
        }
        checkValidateChat(notNullData);
      }
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getChatRoom();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <SafeAreaView>
        {chatRoom ? (
          <FlatList
            data={chatRoom}
            keyExtractor={(e, i) => i.toString()}
            renderItem={data => {
              return (
                <ChatRoomRow
                  id={data.item._id}
                  chatId={data.item.chat_id}
                  userId={data.item.user_id}
                  content={data.item.content}
                  createdAt={data.item.created_at}
                  nickName={data.item.nick_name}
                  profilePhoto={data.item.profile_photo}
                  gender={data.item.gender}
                  birth={data.item.birth}
                  navigateCallback={navigateChatRoom}
                />
              );
            }}
          />
        ) : (
          <ActivityIndicator />
        )}
      </SafeAreaView>
    </>
  );
};

export default Chat;
