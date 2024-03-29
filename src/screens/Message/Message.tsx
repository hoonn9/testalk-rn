import React, { useEffect, useState, createRef, useLayoutEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useMutation, useSubscription, useLazyQuery } from '@apollo/react-hooks';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderButtons, HeaderButton, HiddenItem, OverflowMenu } from 'react-navigation-header-buttons';
import Modal from 'react-native-modal';
import SendMessage from '../../components/SendMessage';
import useInput from '../../hooks/useInput';
import MessageRow from '../../components/MessageRow';
import { toast } from '../../tools';
import { SUBSCRIBE_MESSAGE, SEND_MESSAGE, LEAVE_CHAT, GET_CHAT_USER } from './Message.queries';
import {
    SendChatMessage,
    SendChatMessageVariables,
    MessageSubscription,
    LeaveChat,
    LeaveChatVariables,
    GetChatUser,
    GetChatUserVariables,
    MessageSubscriptionVariables,
} from '../../types/api';
import {
    getChatLogs,
    addMessage,
    addFriend,
    ChatLogRowProp,
    getUserInfoFromId,
    UserInfoProp,
    removeChat,
    blockFriend,
    unblockFriend,
} from '../../dbTools';
import ModalSelector from '../../components/ModalSelector';
import styles from '../../styles';
import { initTimestamp } from '../../utils';
import ModalAlert from '../../components/ModalAlert';
import EmptyScreen from '../../components/EmptyScreen';
import HeaderImageButton from '../../components/HeaderPhotoButton';
import { useHeaderHeight } from '@react-navigation/stack';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

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

type MessageNaviProp = {
    Message: {
        userId: number;
        userInfo: {
            nickName: string;
            birth: number;
            gender: string;
            intro: string;
            profilePhoto: string;
        };
    };
};

type ProfileScreenRouteProp = RouteProp<MessageNaviProp, 'Message'>;

interface IProp {
    route: ProfileScreenRouteProp;
}

const MaterialHeaderButton = (props: any) => <HeaderButton iconSize={23} color="blue" {...props} />;

const LEAVE = 'LEAVE';

const Message: React.FunctionComponent<IProp> = ({ route }) => {
    const navigation = useNavigation();
    const { userId, userInfo: receiveUserInfo } = route.params;

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isLeaveModalVisible, setIsLeaveModalVisible] = useState<boolean>(false);
    const [isBlockModalVisible, setIsBlockModalVisible] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [isCashVisible, setIsCashVisible] = useState<boolean>(false);

    const modalConfirmEvent = async () => {
        try {
            console.log(chatId);
            if (chatId) {
                const { data } = await leaveChatMutation({
                    variables: {
                        id: chatId,
                    },
                });
                console.log(data);
                if (data && data.LeaveChat) {
                    if (data.LeaveChat.ok) {
                        removeChat(userId, chatId);
                        navigation.goBack();
                        setIsModalVisible(false);
                    }
                }
            } else {
                setIsModalVisible(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const blockConfirmEvent = async () => {
        try {
            if (isBlocked) {
                unblockFriend(userId);
                setIsBlocked(false);
                toast('차단이 해제 되었어요.');
            } else {
                blockFriend(userId);
                setIsBlocked(true);
                toast('차단 완료 되었어요.');
            }
        } catch (error) {
            toast('차단 등록/해제 중 실패했어요.');
            console.log(error);
        } finally {
            setIsBlockModalVisible(false);
        }
    };

    const leaveModalConfirmEvent = () => {
        navigation.navigate('TabNavigation');
    };
    const headerHeight = useHeaderHeight();
    const imageOnPress = () => navigation.navigate('Profile', { userId: userId });
    // 헤더 버튼 생성
    useLayoutEffect(() => {
        navigation.setOptions({
            title: receiveUserInfo.nickName,
            headerTitle: (props: any) => (
                <HeaderImageButton
                    {...props}
                    uri={receiveUserInfo.profilePhoto}
                    gender={receiveUserInfo.gender}
                    headerHeight={headerHeight}
                    nickName={receiveUserInfo.nickName}
                    imageOnPress={imageOnPress}
                />
            ),
            headerRight: () => <MessageHeaderButton />,
        });
    }, [navigation, isBlocked]);

    const MessageHeaderButton = () => {
        return (
            <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
                <OverflowMenu OverflowIcon={<Icon name="more-vert" size={23} color={styles.blackColor} />}>
                    <HiddenItem
                        title={isBlocked ? '차단 해제' : '차단하기'}
                        onPress={() => setIsBlockModalVisible(true)}
                    />
                    <HiddenItem title="나가기" onPress={() => setIsModalVisible(true)} />
                </OverflowMenu>
            </HeaderButtons>
        );
    };

    const [myId, setMyId] = useState<number | null>(null);
    const [chatId, setChatId] = useState<number | null>(null);
    const messageContent = useInput('');
    const [flatRef, setFlatRef] = useState<any>(() => createRef());
    const [messageList, setMessageList] = useState<Array<IMessage>>([]);
    const MESSAGES_LIMIT: number = 10;
    const [offset, setOffset] = useState<number>(10);
    const [selectCount, setSelectCount] = useState<number>(0);
    const [userInfo, setUserInfo] = useState<UserInfoProp>();
    const [isSendLoading, setIsSendLoading] = useState<boolean>(false);

    const [getChatUser, { data: getChatUserData, loading: getChatUserLoading, error: getChatUserError }] = useLazyQuery<
        GetChatUser,
        GetChatUserVariables
    >(GET_CHAT_USER, {
        fetchPolicy: 'network-only',
    });

    const [sendMessageMutation] = useMutation<SendChatMessage, SendChatMessageVariables>(SEND_MESSAGE);

    const [leaveChatMutation] = useMutation<LeaveChat, LeaveChatVariables>(LEAVE_CHAT);

    const { data: subscribeData, loading: subscribeLoading, error: subscribeError } = useSubscription<
        MessageSubscription,
        MessageSubscriptionVariables
    >(SUBSCRIBE_MESSAGE, { variables: { chatId: chatId || -1 }, skip: !chatId });

    const onEndReached = async () => {
        if (chatId) {
            const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT, offset);
            if (chatLogs) {
                setMessageList([...messageList, ...chatLogs.array]);
                setOffset(offset + MESSAGES_LIMIT);
                setSelectCount(selectCount + 1);
            }
        }
    };

    //Info intialize

    useEffect(() => {
        const initChat = async () => {
            const getMyId = await AsyncStorage.getItem('userId');
            const getUserInfo = await getUserInfoFromId(userId);

            if (getMyId) {
                setMyId(parseInt(getMyId));
            } else {
                setMyId(null);
                toast('잘못된 접근 입니다.');
            }

            // 유저 정보 DB에 있을 경우
            if (getUserInfo) {
                const chatId = getUserInfo.chat_id;

                setChatId(chatId);
                setUserInfo(getUserInfo);
                setIsBlocked(getUserInfo.blocked ? true : false);

                if (chatId) {
                    await getChatUser({
                        variables: {
                            id: chatId,
                        },
                    });

                    const chatLogs = await getChatLogs(chatId, MESSAGES_LIMIT);
                    if (chatLogs) {
                        if (chatLogs.array.length > 0) {
                            console.log(chatLogs.array);
                            const messages: IMessage[] = [];
                            for (const message of chatLogs.array) {
                                messages.push({
                                    _id: message._id,
                                    text: message.content,
                                    createdAt: message.created_at,
                                    user: {
                                        _id: message.user_id,
                                    },
                                });
                            }

                            setMessageList(messages);
                            return messages;
                        } else {
                            return null;
                        }
                    }
                }
            }
        };
        initChat();
    }, []);

    const addMessageList = (chatId: number, userId: number, text: string, createdAt: string) => {
        // const existSeparate = messageList.find(e => e.created_at >= initTimestamp(parseInt(createdAt)));
        setMessageList(prev =>
            GiftedChat.append(prev, [
                {
                    _id: messageList.length,
                    text: text,
                    createdAt: parseInt(createdAt),
                    user: {
                        _id: userId,
                    },
                },
            ]),
        );
    };

    // Subscribe Chat
    useEffect(() => {
        if (subscribeData) {
            console.log(subscribeData);
            if (subscribeData.MessageSubscription) {
                try {
                    const { userId, text, target, createdAt } = subscribeData.MessageSubscription;
                    console.log(chatId, userId);

                    if (chatId && userId) {
                        if (userId !== myId && target === LEAVE) {
                            // 상대가 떠났을 때
                            removeChat(userId, chatId);
                            setIsLeaveModalVisible(true);
                        } else {
                            if (text) {
                                addMessageList(chatId, userId, text, createdAt);

                                // 수신 시 최하단으로 스크롤
                                // if (flatRef && messageList.length > 0) {
                                //     flatRef.scrollToIndex({ index: 0 });
                                // }
                            }
                        }
                    } else {
                        toast('데이터 수신 중 오류가 발생하였습니다.');
                    }
                } catch (error) {
                    console.log(error);
                    toast('데이터 수신 중 오류가 발생하였습니다.');
                }
            }
        }
    }, [subscribeData]);

    const senderOnSubmit = async (message: IMessage) => {
        setIsCashVisible(false);
        setIsSendLoading(true);
        if (myId) {
            const now = new Date().getTime().toString();
            try {
                const { data } = await sendMessageMutation({
                    variables: {
                        chatId,
                        receiveUserId: userId,
                        text: message.text,
                        sendTime: now,
                    },
                });
                console.log(data);
                console.log(message.text);
                if (data && data.SendChatMessage.ok && data.SendChatMessage.chatId) {
                    const sendedChatId = data.SendChatMessage.chatId;
                    addMessage(sendedChatId, myId, userId, message.text, parseInt(now));
                    if (userInfo) {
                        addFriend({
                            userId,
                            chatId: sendedChatId,
                            nickName: userInfo.nick_name,
                            birth: userInfo.birth,
                            gender: userInfo.gender,
                            intro: userInfo.intro,
                            profilePhoto: userInfo.profile_photo,
                        });
                    } else {
                        if (receiveUserInfo) {
                            addFriend({
                                userId,
                                chatId: sendedChatId,
                                nickName: receiveUserInfo.nickName,
                                birth: receiveUserInfo.birth,
                                gender: receiveUserInfo.gender,
                                intro: receiveUserInfo.intro,
                                profilePhoto: receiveUserInfo.profilePhoto,
                            });
                        } else {
                            toast('상대를 저장하는데 실패했어요.');
                        }
                    }

                    // 첫 대화
                    if (!chatId) {
                        addMessageList(sendedChatId, myId, message.text, now);
                    }

                    setChatId(sendedChatId);
                    //messageContent.setValue('');
                } else {
                    toast('문제가 생겨 메시지를 보낼 수 없어요.');
                }
            } catch (error) {
                toast('문제가 생겨 메시지를 보낼 수 없어요.');
                console.log(error);
            } finally {
                setIsSendLoading(false);
            }
        } else {
            toast('잘못된 접근이에요.');
        }
    };

    useEffect(() => {
        if (chatId && getChatUserData && getChatUserData.GetChatUser) {
            if (getChatUserData.GetChatUser.ok) {
                if (getChatUserData.GetChatUser.user) {
                    const { id, nickName, birth, gender, intro, profilePhoto } = getChatUserData.GetChatUser.user;
                    // TODO
                    // 유저 정보 업데이트
                    addFriend({
                        userId: id,
                        chatId,
                        nickName,
                        birth: parseInt(birth),
                        gender,
                        intro,
                        profilePhoto: profilePhoto && profilePhoto.length > 0 ? profilePhoto[0].url : null,
                    });
                } else {
                    // 상대가 떠났을 때
                    // 로컬 DB에서 제거
                    removeChat(userId, chatId);
                    setIsLeaveModalVisible(true);
                }
            } else {
                // 에러 처리
                toast('잘못된 접근입니다.');
                setIsLeaveModalVisible(true);
            }
        }
    }, [getChatUserData, getChatUserLoading, getChatUserError]);

    const sendMessageOnPress = (message: IMessage[]) => {
        // if (!messageContent.value || isSendLoading) {
        //     return;
        // } else if (messageContent.value.length >= 500) {
        //     toast('메시지는 500자 이내로 전송할 수 있습니다.');
        //     return;
        // }

        if (chatId) {
            senderOnSubmit(message[0]);
        } else {
            setIsCashVisible(true);
        }
    };

    console.log(messageList);
    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Wrapper>
                        {chatId && myId ? (
                            <GiftedChat
                                messages={messageList}
                                onSend={message => sendMessageOnPress(message)}
                                user={{ _id: myId }}
                            />
                        ) : (
                            <EmptyScreen text="상대방이 메시지를 기다리고 있어요!" />
                        )}
                    </Wrapper>
                </Container>
            </TouchableWithoutFeedback>
            <Modal
                isVisible={isCashVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}
                swipeDirection={['down']}
                onSwipeComplete={() => setIsCashVisible(false)}>
                <ModalSelector
                    description="상대방과 대화를 시작하는데 30캐시가 필요해요. 메시지를 보내시겠어요?"
                    confirmEvent={senderOnSubmit}
                    confirmTitle="네"
                    cancelEvent={() => setIsCashVisible(false)}
                    position="center"
                />
            </Modal>
            <Modal
                isVisible={isModalVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}
                swipeDirection={['down']}
                onSwipeComplete={() => setIsModalVisible(false)}>
                <ModalSelector
                    description="대화를 끝내시겠습니까?"
                    confirmEvent={modalConfirmEvent}
                    confirmTitle="나가기"
                    cancelEvent={() => setIsModalVisible(false)}
                />
            </Modal>
            <Modal
                isVisible={isBlockModalVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}
                swipeDirection={['down']}
                onSwipeComplete={() => setIsBlockModalVisible(false)}>
                <ModalSelector
                    description={isBlocked ? '차단을 해제하시겠어요?' : '상대를 차단하시겠어요?'}
                    confirmEvent={blockConfirmEvent}
                    confirmTitle="네"
                    cancelEvent={() => setIsBlockModalVisible(false)}
                />
            </Modal>
            <Modal
                isVisible={isLeaveModalVisible}
                animationOut="fadeOutDown"
                backdropColor={styles.modalBackDropColor}
                backdropOpacity={0.3}
                backdropTransitionOutTiming={0}>
                <ModalAlert
                    description="상대방이 대화를 종료했어요."
                    confirmEvent={leaveModalConfirmEvent}
                    confirmTitle="확인"
                />
            </Modal>
        </>
    );
};

export default Message;
