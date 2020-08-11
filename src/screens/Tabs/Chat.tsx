import React, {useEffect, useState, useCallback, useRef} from 'react';
import {ActivityIndicator, FlatList, AppState} from 'react-native';
import styled from 'styled-components/native';
import ChatRoomRow from '../../components/ChatRoomRow';
import {getChatRooms, ChatRoomProp} from '../../dbTools';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {toast} from '../../tools';
import EmptyScreen from '../../components/EmptyScreen';

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
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const getChatRoom = async () => {
    const Rooms = await getChatRooms();
    if (Rooms) {
      const sortedRooms = Rooms.array.sort((a, b) =>
        a.created_at > b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0,
      );
      setChatRoom(sortedRooms);
    }
  };

  const navigateChatRoom = useCallback((userId: number, userInfo: any) => {
    navigation.navigate('MessageNavigation', {
      userId,
      userInfo,
    });
  }, []);

  useEffect(() => {
    getChatRoom();

    const unsubscribe = messaging().onMessage(getChatRoom);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // onResume Foreground
        getChatRoom();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    };

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('focus');
      getChatRoom();
    });
    return unsubscribe;
  }, [navigation]);

  const imageOnPress = (id: number) => {
    navigation.navigate('Profile', {userId: id});
  };

  return (
    <>
      <SafeAreaView>
        {chatRoom && chatRoom.length > 0 ? (
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
                  imageOnPress={imageOnPress}
                />
              );
            }}
          />
        ) : (
          <EmptyScreen text="아직 친구가 없어요. 사람들에게 메시지를 보내보세요!" />
        )}
      </SafeAreaView>
    </>
  );
};

export default Chat;
