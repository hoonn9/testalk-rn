import React, {useEffect, useState, useCallback} from 'react';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks';
import UserProfile from '../../components/UserProfile';
import {NavigationTabScreenProps} from 'react-navigation-tabs';
import {withNavigation, NavigationEvents} from 'react-navigation';
import {getItemChatRow, getChatLogs} from '../../dbTools';
import AsyncStorage from '@react-native-community/async-storage';
import ChatRoomRow from '../../components/ChatRoomRow';
import {ActivityIndicator, FlatList} from 'react-native';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const IndicatorView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
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

  const navigateChatRoom = useCallback(
    (chatId: number, receiveUserId: number, requestTime: string) => {
      console.log('Clicked row req Time', requestTime);
      navigation.navigate('MessageNavigation', {
        receiveUserId,
        chatId,
        requestTime,
      });
    },
    [],
  );
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
