/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {setItemChatRooms, addMessage} from './src/dbTools';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async notification => {
  //console.log('Message handled in the background!', notification);
  try {
    const {
      data: {
        nickName,
        chatId,
        messageId,
        userId,
        receiveUserId,
        content,
        createdAt,
      },
    } = notification;
    PushNotification.localNotification({
      id: userId,
      title: nickName,
      message: content,
      group: 'b5a4l4o2g4o4',
      channelId: userId,
    });
    setItemChatRooms(parseInt(userId), parseInt(chatId), content, createdAt);
    // 받은 메시지의 인수는 보낸 USER ID
    addMessage(
      parseInt(chatId),
      parseInt(messageId),
      parseInt(userId),
      parseInt(userId),
      content,
      createdAt,
    );
  } catch (error) {
    console.log(error);
  }
});

const AppWithHeadless = ({isHeadless}) => {
  if (isHeadless) {
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => AppWithHeadless);
