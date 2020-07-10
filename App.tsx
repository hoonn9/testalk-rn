import React, {useState, useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ApolloClient} from 'apollo-client';
import {concat, split, from} from 'apollo-link';
import {setContext} from 'apollo-link-context';
import {ThemeProvider} from 'styled-components';
import {ApolloProvider} from '@apollo/react-hooks';
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';
import {PersistentStorage, PersistedData} from 'apollo-cache-persist/types';
import {onError} from 'apollo-link-error';
import {HttpLink} from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import getEnvVars from './src/enviroments';
import {AuthProvider} from './src/AuthContext';
import NavContoller from './src/components/NavContoller/NavContoller';
import styles from './src/styles';
import {vibration} from './src/tools';
import gql from 'graphql-tag';
import messaging from '@react-native-firebase/messaging';
import {createTable, setItemChatRooms, addMessage} from './src/dbTools';
import PushNotification from 'react-native-push-notification';

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
        storage: AsyncStorage as PersistentStorage<
          PersistedData<NormalizedCacheObject>
        >,
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
        ({query}) => {
          const {kind, operation}: any = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink,
      );

      const errorLink = onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors) {
          graphQLErrors.map(({message}) => {
            Alert.alert(`Unexpected error: ${message}`);
          });
        }
        if (networkError) {
          console.log(networkError);
          Alert.alert('Network error:', `${networkError}`, [
            {text: '종료', onPress: () => BackHandler.exitApp()},
          ]);
        }
      });

      const client = new ApolloClient({
        link: from([errorLink, concat(authMiddleware, combinedLinks)]),
        cache,
        resolvers: {
          Query: {
            GetLocalChatMessages: async (_: any, args: any, {cache}: any) => {
              console.log('Get Local Chat Messages', args);
              const query = gql`
                query($id: Int!) {
                  GetChatMessages(chatId: $id, requestTime: $requestTime) {
                    __typename
                    ok
                    error
                    messages {
                      __typename
                      id
                      userId
                      chatId
                      text
                      createdAt
                    }
                  }
                }
              `;
              try {
                const previous = cache.readQuery({
                  query,
                  variables: {
                    id: args.id,
                    requestTime: null,
                  },
                });
                console.log('prev', previous);
                if (previous) {
                  return previous.GetChatMessages;
                } else {
                  return null;
                }
              } catch (error) {
                console.log('뮤테이션 에러', error);
                return null;
              }
            },
          },
          Mutation: {
            SetLocalChatMessages: async (_: any, args: any, {cache}: any) => {
              console.log('Set Local Chat Messages:', args);
              const query = gql`
                query($id: Int!) {
                  GetChatMessages(chatId: $id, requestTime: $requestTime) {
                    __typename
                    ok
                    error
                    messages {
                      __typename
                      id
                      userId
                      chatId
                      text
                      createdAt
                    }
                  }
                }
              `;
              try {
                const previous = cache.readQuery({
                  query,
                  variables: {
                    id: args.id,
                    requestTime: null,
                  },
                });
                const {GetChatMessages} = previous;
                console.log('mutation prev', previous);
                const data = Object.assign({}, GetChatMessages, {
                  GetChatMessages: {
                    __typename: 'GetChatMessagesResponse',
                    error: 'TestError',
                    messages: [...GetChatMessages.messages, ...args.messages],
                    ok: true,
                  },
                });
                if (previous) {
                  cache.writeQuery({
                    query,
                    variables: {id: args.id, requestTime: null},
                    data: data,
                  });
                  return null;
                } else {
                  return null;
                }
              } catch (error) {
                console.log('뮤테이션 에러', error);
                return null;
              }
            },
            InitLocalChatMessages: async (_: any, args: any, {cache}: any) => {
              console.log('Init Local Chat Messages:', args);
              const query = gql`
                query($id: Int!) {
                  GetLocalChatMessages(id: $id) {
                    __typename
                    ok
                    error
                    messages {
                      __typename
                      id
                      userId
                      chatId
                      text
                      createdAt
                    }
                  }
                }
              `;
              try {
                cache.writeQuery({
                  query,
                  variables: {id: args.id, requestTime: null},
                  data: {
                    GetLocalChatMessages: {
                      __typename: '',
                      ok: '',
                      error: '',
                      messages: [],
                    },
                  },
                });
                return null;
              } catch (error) {
                console.log(error);
                return null;
              }
            },
          },
        },
      });

      // 개발용 로그인 코드
      // await AsyncStorage.setItem(
      //   'jwt',
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTU5MzU5MzcyNH0.6Dap2IeU4U9iksb-Pz8PlggHNM5JG-gnc3HVWRzvWGw',
      // );
      // await AsyncStorage.setItem('isLoggedIn', 'true');
      // await AsyncStorage.setItem('userId', '15');

      // await AsyncStorage.setItem(
      //   "jwt",
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTU5MzYwMzg4N30.TKboTzBUx1lFDUE-7yB3bulQzF1I6vO4ehkOs8hvJhk"
      // );
      // await AsyncStorage.setItem("isLoggedIn", "true");
      // await AsyncStorage.setItem("userId", "14");

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

  const handleNotification = (notification: any) => {
    console.log(notification);
    vibration();
    const {
      data: {chatId, messageId, userId, receiveUserId, content, createdAt},
    } = notification;
    setItemChatRooms(userId, chatId, content, createdAt);
    // 받은 메시지의 인수는 보낸 USER ID
    addMessage(chatId, messageId, userId, userId, content, createdAt);
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
        <AuthProvider isLoggedIn={isLoggedIn} setIsRoomIn={setIsRoomIn}>
          <NavContoller />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : null;
}
