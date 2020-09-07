import React, { useState, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloClient } from 'apollo-client';
import { concat, split, from } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import getEnvVars from './src/enviroments';
import { AuthProvider } from './src/AuthContext';
import NavContoller from './src/components/NavContoller/NavContoller';
import styles from './src/styles';
import { vibration } from './src/tools';
import messaging from '@react-native-firebase/messaging';
import { createTable, addMessage, addFriend, getUserInfoFromId } from './src/dbTools';
import PushNotification from 'react-native-push-notification';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';

export default function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [client, setClient] = useState<ApolloClient<any> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isRoomIn, setIsRoomIn] = useState<boolean>(false);

  const preLoad = async () => {
    try {
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage as PersistentStorage<PersistedData<NormalizedCacheObject>>,
      });

      const httpLink = new HttpLink({
        uri: getEnvVars().apiUrl + 'graphql',
      });

      const wsLink = new WebSocketLink({
        options: {
          connectionParams: async () => {
            const token = await AsyncStorage.getItem('jwt');
            return {
              'X-JWT': token,
            };
          },
          reconnect: true,
        },
        uri: getEnvVars().apiUrl + 'subscription',
      });

      const authMiddleware = setContext(async () => {
        const token = await AsyncStorage.getItem('jwt');
        return {
          headers: {
            'X-JWT': token,
          },
        };
      });

      const combinedLinks = split(
        ({ query }) => {
          const { kind, operation }: any = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink,
      );

      const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message }) => {
            Alert.alert(`Unexpected error: ${message}`);
          });
        }
        if (networkError) {
          console.log(networkError);
          Alert.alert('Network error:', `${networkError}`, [{ text: '종료', onPress: () => BackHandler.exitApp() }]);
        }
      });

      const client = new ApolloClient({
        link: from([errorLink, concat(authMiddleware, combinedLinks)]),
        cache,
      });

      const jwt = await AsyncStorage.getItem('jwt');
      console.log(jwt);
      // 개발용 로그인 코드
      // await AsyncStorage.setItem(
      //   'jwt',
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTU5MzU5MzcyNH0.6Dap2IeU4U9iksb-Pz8PlggHNM5JG-gnc3HVWRzvWGw',
      // );
      // await AsyncStorage.setItem('isLoggedIn', 'true');
      // await AsyncStorage.setItem('userId', '15');

      // await AsyncStorage.setItem(
      //   'jwt',
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTU5MzYwMzg4N30.TKboTzBUx1lFDUE-7yB3bulQzF1I6vO4ehkOs8hvJhk',
      // );
      // await AsyncStorage.setItem('isLoggedIn', 'true');
      // await AsyncStorage.setItem('userId', '14');

      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      if (!isLoggedIn || isLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      if (!isLoggedIn || isLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNotification = async (notification: any) => {
    console.log(notification);

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
    vibration();
    // 받은 메시지의 인수는 보낸 USER ID
    addFriend({
      userId,
      chatId,
      nickName,
      birth: new Date(birth).getTime(),
      gender,
      intro: '',
      profilePhoto,
    });
    addMessage(chatId, userId, userId, content, parseInt(createdAt));
  };

  useEffect(() => {
    createTable();
    preLoad();

    PushNotification.configure({
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    const unsubscribe = messaging().onMessage(handleNotification);

    return unsubscribe;
    // return () => {
    //   Notifications.removeAllNotificationListeners();
    //   //subscription.remove()
    // };
  }, []);

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <OverflowMenuProvider>
          <AuthProvider isLoggedIn={isLoggedIn} setIsRoomIn={setIsRoomIn}>
            <NavContoller />
          </AuthProvider>
        </OverflowMenuProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : null;
}
