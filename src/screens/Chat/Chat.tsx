import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {NavigationTabScreenProps} from 'react-navigation-tabs';
import {withNavigation, NavigationEvents} from 'react-navigation';
import ChatRoomRow from '../../components/ChatRoomRow';
import {getChatRooms, ChatRoomProp} from '../../dbTools';
import {useQuery} from '@apollo/react-hooks';
import {GetMyChat, GetMyChat_GetMyChat_chat} from '../../types/api';
import {GET_MY_CHAT} from './Chat.queries';
import {lessThan} from 'react-native-reanimated';

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

interface IProp extends NavigationTabScreenProps {}

const Chat: React.FunctionComponent<IProp> = ({navigation}) => {
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

  const checkValidateChat = (chats: Array<GetMyChat_GetMyChat_chat | null>) => {
    console.log(chats[0]);
    // 상대가 나간 채팅
    let leaveChat = [];
    let dbChats = [];
    let serverChats = [];
    if (chatRoom) {
      for (let i = 0; i < chats.length; i++) {
        if (chats[i]) serverChats.push(chats[i].id);
      }
      for (let i = 0; i < chatRoom.length; i++) {
        dbChats.push(chatRoom[i].chat_id);
      }
      console.log(setDifference(dbChats, serverChats));
    }

    // if (chatRoom && chats.length > 0) {
    //   const dbChats = chatRoom.sort((a: ChatRoomProp, b: ChatRoomProp) =>
    //     a.chat_id > b.chat_id ? 1 : a.chat_id < b.chat_id ? -1 : 0,
    //   );
    //   const serverChats = chats.sort((a: any, b: any) =>
    //     a.id > b.id ? 1 : a.id < b.id ? -1 : 0,
    //   );
    //   dbChats.diff
    //   if (dbChats && serverChats) {
    //     console.log(serverChats);
    //     for (let i = 0; i < serverChats.length; i++) {
    //       // 로컬 DB 랑 비교해서 없으면 제거
    //       for (let j = 0; j < dbChats.length; j++) {
    //         if (serverChats[i]) {
    //           if (serverChats[i].id === dbChats[j].chat_id) {

    //           }
    //         } else {

    //         }
    //       }
    //     }
    //   }
    // }
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
        checkValidateChat(data.GetMyChat.chat);
      }
    }
  }, [data]);
  return (
    <>
      <SafeAreaView>
        <NavigationEvents
          onWillFocus={() => {
            getChatRoom();
          }}
        />
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

export default withNavigation(Chat);
