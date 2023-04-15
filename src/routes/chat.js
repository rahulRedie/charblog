import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../App";
import axios from "axios";
import socket from "../socket";
import { v4 as uuidv4 } from "uuid";
import { decrypt, encrypt } from "../cryptography";
const moment = require("moment");
export default function Chat() {
    const params = useParams();
    const chatId = params.chatId;
    const [curId, setCurId] = useContext(userContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user2_id, setUser2_id] = useState(11);
    const [tmpMessages, settmpMessages] = useState([]);
    const tmpMessagesRef = useRef([]);
    tmpMessagesRef.current = tmpMessages;
    // console.log(chatId);
    useEffect(() => {
        settmpMessages([]);
        axios
            .get("https://chat-app-new.herokuapp.com/chatDetails", {
                params: {
                    id: chatId,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setMessages(response.data);
                axios
                    .get("https://chat-app-new.herokuapp.com/usersInChat", {
                        params: { chat_id: chatId },
                    })
                    .then((response2) => {
                        response2.data.user1_id === curId
                            ? setUser2_id(response2.data.user2_id)
                            : setUser2_id(response2.data.user1_id);
                        socket.emit("join-room", chatId);
                        console.log("joined room");
                        console.log("changed id");
                    });
            });
    }, [chatId]);
    useEffect(() => {
        socket.on("receive-message", (msg) => {
            let newMsg = encrypt(msg);
            receiveMessage(msg);
        });
    }, []);
    const sendMsg = () => {
        if (message === "") return;
        const msg = JSON.stringify({
            chat: chatId,
            sender: curId,
            receiver: user2_id,
            content: message,
            timeSt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });

        console.log(encrypt(msg));
        const encMsg = encrypt(msg);

        axios
            .post("https://chat-app-new.herokuapp.com/sendMessage", { data: encMsg })
            .then((response) => {
                if (response.data !== "err") {
                    console.log("message sent");
                    setMessage("");
                    const sendedMessage = {
                        chat: chatId,
                        sender_id: parseInt(curId),
                        receiver_id: user2_id,
                        content: message,
                        timeSt: moment().format("YYYY-MM-DD HH:mm:ss"),
                    };
                    socket.emit("updateMessages", { data: encMsg });
                    socket.emit("notify-chat", chatId);
                    settmpMessages([...tmpMessagesRef.current, sendedMessage]);
                    console.log(parseInt(curId) === sendedMessage.sender_id);
                    console.log(parseInt(curId));
                    console.log(sendedMessage.sender_id);
                }
            });
    };
    const receiveMessage = (msg) => {
        let encMsg = decrypt(msg.data);
        let encMsgJson = JSON.parse(encMsg);
        console.log("sended msg::");
        console.log(encMsgJson);
        settmpMessages([...tmpMessagesRef.current, encMsgJson]);
    };

    return (
        <div className="chatContainer">
            <div className="messagesContainer">
                {messages.map((r) => (
                    <div
                        key={uuidv4()}
                        className={
                            r.sender_id === parseInt(curId)
                                ? "message sent"
                                : "message received"
                        }
                    >
                        <div className="timeStamp">
                            {r.timeSt.replace("T", " ").replace("Z", "")}
                        </div>
                        {r.content}
                    </div>
                ))}
                {tmpMessages.map((r) => (
                    <div
                        key={uuidv4()}
                        className={
                            r.sender_id === parseInt(curId)
                                ? "message sent"
                                : "message received"
                        }
                    >
                        <div className="timeStamp">
                            {r.timeSt.replace("T", " ").replace("Z", "")}
                        </div>
                        {r.content}
                    </div>
                ))}
            </div>
            <div className="newMessageForm">
                <input
                    className="messageInput"
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <input
                    className="messageBtn"
                    type="button"
                    value="send!"
                    onClick={sendMsg}
                />
            </div>
        </div>
    );
}
