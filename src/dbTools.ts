import SQLite from "react-native-sqlite-storage";

export interface UserInfoProp {
    _id: number;
    id: number;
    chat_id: number;
    nick_name: string;
    birth: number;
    gender: string;
    intro: string;
    profile_photo: string;
}

export interface ChatRoomProp extends UserInfoProp {
    user_id: number;
    content: string;
    created_at: string;
}

export interface GetChatRoomProp {
    array: Array<ChatRoomProp>;
    length: number;
}

export interface AddFriendProp {
    userId: number;
    chatId: number;
    nickName: string;
    birth: number;
    gender: string;
    intro: string;
    profilePhoto: string;
}


const db = SQLite.openDatabase({ name: "db.db", location: "default" }, () => { }, (error) => {
    console.log(error)
});

export const createTable = () => {
    db.transaction(tx => {
        tx.executeSql("create table if not exists chat_room (_id INTEGER PRIMARY KEY NOT NULL, id INTEGER, user_id INTEGER, content TEXT, created_at INTEGER)");
        tx.executeSql("create table if not exists chat_logs (_id INTEGER PRIMARY KEY NOT NULL, id INTEGER, " +
            "chat_id INTEGER, user_id INTEGER, content TEXT, created_at INTEGER, FOREIGN KEY (chat_id) REFERENCES chat_room (id))");
        tx.executeSql("create table if not exists friends (_id INTEGER PRIMARY KEY NOT NULL, id INTEGER, " +
            "chat_id INTEGER, nick_name TEXT, birth INTEGER, gender TEXT, intro TEXT, profile_photo TEXT, FOREIGN KEY (chat_id) REFERENCES chat_room (id))");
    });
}

export const addMessage = (chatId: number, messageId: number, senderId: number, receiverId: number, content: string, createdAt: number) => {
    console.log("add message");
    db.transaction(tx => {
        tx.executeSql("insert or replace into chat_room(_id, id, user_id, content, created_at) values ((select id from chat_room where id = ? ), ?, ?, ?, ?)", [chatId, chatId, receiverId, content, createdAt], (_, { insertId }) => {
            tx.executeSql("insert into chat_logs(id, chat_id, user_id, content, created_at) values(?, ?, ?, ?, ?)", [messageId, chatId, senderId, content, createdAt])
        });
    }, (error) => {
        console.log(error);
    }
    );
}



export const getChatRooms = async () => {
    // db.transaction(tx => {
    //     tx.executeSql("drop table chat_room");
    // }, error => console.log(error))

    return new Promise<GetChatRoomProp>((resolve, reject) => {
        //let chatRooms;
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM chat_room t1 INNER JOIN (SELECT * FROM friends) t2 ON t1.user_id = t2.id AND t1.id = t2.chat_id GROUP BY t1.user_id", [], (_: any, { rows }: any) => {
                let chatRooms = []

                for (let i = 0; i < rows.length; i++) {
                    chatRooms.push({ ...rows.item(i) })
                }
                resolve({
                    array: chatRooms,
                    length: rows.length
                });
            })
        }, error => {
            console.log(error);
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

export const addFriends = (friend: AddFriendProp) => {
    console.log("add friends");
    const { userId, chatId, nickName, birth, gender, intro, profilePhoto } = friend;
    db.transaction(tx => {
        tx.executeSql("insert or replace into friends(_id, id, chat_id, nick_name, birth, gender, intro, profile_photo) " +
            "values ((select _id from friends where id = ? ), ?, ?, ?, ? ,? ,? ,?)", [userId, userId, chatId, nickName, birth, gender, intro, profilePhoto], (_, { insertId }) => {
                //TODO
            });
    }, (error) => {
        console.log(error);
    }
    );
}

export const getUserInfoFromId = async (userId: number) => {
    return new Promise<UserInfoProp>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql("select * from friends where id = ?", [userId], (_: any, { rows }: any) => {
                const friend = rows.item(0)
                resolve(friend);
            })
        }
        );
    })
}