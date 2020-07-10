import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import styled from 'styled-components/native';
import {NavigationTabScreenProps} from 'react-navigation-tabs';
import {withNavigation, NavigationEvents} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ChatRoomRow from '../../components/ChatRoomRow';
import {getChatLogs} from '../../dbTools';

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
interface ChatRoomProp {
  chatId: number;
  userId: number;
  content: string;
  createdAt: string;
  requestTime: string;
}
const Chat: React.FunctionComponent<IProp> = ({navigation}) => {
  const [chatRoom, setChatRoom] = useState<Array<ChatRoomProp> | null>(null);

  const getChatRoom = async () => {
    const chatItem = await AsyncStorage.getItem('Chat');
    if (chatItem) {
      const chatRooms = JSON.parse(chatItem)['rooms'];
      console.log(chatItem);
      let rooms: Array<ChatRoomProp> = [];
      for (let k in chatRooms) {
        rooms.push(chatRooms[k]);
      }
      setChatRoom(rooms);
    }
  };

  const navigateChatRoom = useCallback((userId: number) => {
    navigation.navigate('MessageNavigation', {
      userId,
    });
  }, []);
  const getChatLog = async () => {
    const chatLogs = await getChatLogs(126);
    console.log(chatLogs);
  };

  useEffect(() => {
    getChatRoom();
    getChatLog();
  }, [navigation]);

  return (
    <>
      <SafeAreaView>
        <NavigationEvents
          onWillFocus={() => {
            getChatRoom();
            getChatLog();
            console.log('focus');
          }}
        />
        {chatRoom ? (
          <FlatList
            data={chatRoom}
            keyExtractor={(e, i) => i.toString()}
            renderItem={data => {
              return (
                <ChatRoomRow
                  id={data.item.chatId}
                  chatId={data.item.chatId}
                  userId={data.item.userId}
                  content={data.item.content}
                  createdAt={data.item.createdAt}
                  requestTime={data.item.requestTime}
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
