/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { addMessage, addFriend, getUserInfoFromId } from './src/dbTools';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async notification => {
    console.log('Message handled in the background!', notification);
    try {
        const {
            data: { user, chatId, content, createdAt },
        } = notification;

        const { userId, nickName, birth, gender, profilePhoto } = JSON.parse(user);

        const clientUser = await getUserInfoFromId(userId);
        if (clientUser) {
            if (clientUser.blocked) {
                return;
            }
        }

        PushNotification.localNotification({
            id: userId,
            title: nickName,
            message: content,
            group: 'b5a4l4o2g4o4',
            channelId: userId,
        });

        addFriend({
            userId,
            chatId,
            nickName,
            birth: new Date(birth).getTime(),
            gender,
            intro: '',
            profilePhoto,
        });

        // 받은 메시지의 인수는 보낸 USER ID
        addMessage(chatId, userId, userId, content, parseInt(createdAt));
    } catch (error) {
        console.log(error);
    }
});

const AppWithHeadless = ({ isHeadless }) => {
    if (isHeadless) {
        return null;
    }

    return <App />;
};

AppRegistry.registerComponent(appName, () => AppWithHeadless);
