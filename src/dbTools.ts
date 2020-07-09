import React, { useState } from "react";
import { toast } from "./tools";
import AsyncStorage from "@react-native-community/async-storage";
import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase({ name: "db.db", location: "default" }, () => { }, (error) => {
    console.log(error)
});

export const createTable = () => {

    // 테이블 삭제 (재생성 용도)
    // db.transaction(tx => {
    //     tx.executeSql("drop table message, chatRoom");
    // })
    db.transaction(tx => {
        tx.executeSql("create table if not exists chat_room (_id integer primary key not null, id integer, receive_user_id integer)");
        tx.executeSql("create table if not exists chat_logs (_id integer primary key not null, id integer, " +
            "chat_id integer, user_id integer, content text, created_at integer, FOREIGN KEY (chat_id) REFERENCES chat_room (id))");
    });
}

export const addMessage = (chatId: number, messageId: number, userId: number, receiveUserId: number, content: string, createdAt: string) => {
    console.log("add message");
    db.transaction(tx => {
        tx.executeSql("insert or replace into chat_room(_id, id, receive_user_id) values ((select id from chat_room where id = ? ), ?, ?)", [chatId, chatId, receiveUserId], (_, { insertId }) => {
            tx.executeSql("insert into chat_logs(id, chat_id, user_id, content, created_at) values(?, ?, ?, ?, ?)", [messageId, chatId, userId, content, createdAt])
        });
    }, (error) => {
        console.log(error);
    }
    );
}

export const getChatRooms = async () => {
    // db.transaction(tx => {
    //     tx.executeSql("drop table chat_logs");
    // }, error => console.log(error))

    //테이블 목록 확인
    // db.transaction(tx => {
    //     tx.executeSql("select * from sqlite_master where type = 'table'", [], (_: any, { rows }: any) => {
    //         console.log(rows)
    //         //tx.executeSql("insert into message(chat_room_id, chat_id, user_id, content, updatedAt) values(?, ?, ?, ?, ?)", []")
    //     })
    // });

    return new Promise<any>((resolve, reject) => {
        //let chatRooms;
        db.transaction(tx => {
            tx.executeSql("select * from chatRoom", [], (_: any, { rows }: any) => {
                resolve(rows);
                //console.log(rows)
                //tx.executeSql("insert into message(chat_room_id, chat_id, user_id, content, updatedAt) values(?, ?, ?, ?, ?)", []")
            })
        }
        );
    })
}
export interface ChatLogRowProp {
    _id: number,
    chat_id: number,
    content: string,
    created_at: number,
    id: number,
    user_id: number,
}

export interface ChatLogProp {
    array: Array<ChatLogRowProp>,
    length: number
}

export const getChatLogs = async (chatId: number, limit: number = 10, offset: number = 0) => {
    // db.transaction(tx => {
    //     tx.executeSql("drop table chat_logs");
    // }, error => console.log(error))
    return new Promise<ChatLogProp>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM chat_logs WHERE chat_id = ? ORDER BY _id DESC, created_at DESC LIMIT ? OFFSET ?", [chatId, limit, offset], (_: any, { rows }: any) => {
                let messages = []

                for (let i = 0; i < rows.length; i++) {
                    messages.push({ ...rows.item(i) })
                }
                resolve({
                    array: messages,
                    length: rows.length
                });
            })
        }, error => {
            console.log(error)
            reject()
        }
        );
    }).catch(error => {
        console.log(error);
    })
}

//AsyncStorage

export const getChatRoomMessages = async (chat_id: number) => {
    return new Promise<any>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("select * from message where chat_id = ?", [chat_id], (_: any, { rows }: any) => {
                resolve(rows);
                //console.log(rows)
                //tx.executeSql("insert into message(chat_room_id, chat_id, user_id, content, updatedAt) values(?, ?, ?, ?, ?)", []")
            })
        }
        );
    })
}

export const getChatFromUser = async (receiveUserId: number) => {
    const chatRooms = await getChatRooms();
    //console.log(chatRooms, receiveUserId);
    for (let i = 0; i < chatRooms.length; i++) {
        //console.log(chatRooms._array[i]["receive_user_id"]);
        if (chatRooms._array[i]["receive_user_id"] === receiveUserId) {
            return { id: chatRooms._array[i]["id"], chatId: chatRooms._array[i]["chat_id"] };
        }
    }

}

interface ChatStorageProp {
    rooms: Array<any>
}

export const setItemChatRooms = (userId: number, chatId: number, text: string, createdAt: string) => {
    return new Promise(async (resolve, reject) => {
        const addObject = { rooms: { [chatId]: { chatId, userId, content: text, createdAt } } }
        await AsyncStorage.setItem("Chat", JSON.stringify(addObject)).then(() => resolve(addObject)).catch(() => reject());
    })
}

export const setItemChatRoomTime = (chatId: number, requestTime: string) => {
    return new Promise(async (resolve, reject) => {
        const chat = await AsyncStorage.getItem("Chat")
        if (chat) {
            const chatObject = Object.assign({}, JSON.parse(chat)["rooms"][chatId], { requestTime });
            const addObject = { rooms: { [chatId]: chatObject } }
            await AsyncStorage.setItem("Chat", JSON.stringify(addObject)).then(() => resolve(addObject)).catch(() => reject());
        } else {
            reject();
        }
    })
}

export const getItemChatRow = async (chatId: number) => {
    return new Promise(async (resolve, reject) => {
        const chat = await AsyncStorage.getItem("Chat");
        if (chat) {
            const chatObject = JSON.parse(chat);
            resolve(chatObject["rooms"][chatId])
        } else {
            reject()
        }
    })
}