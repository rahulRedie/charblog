import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import socket from "../socket";
import "../styles/chat.css";
export default function ChatAddForm() {
    const navigate = useNavigate();
    const [newMsgArray, setNewMsgArray] = useState([0]);
    const [chats, setChats] = useState([]);
    const [username, setUserName] = useState("");
    const [curId, setCurId] = useContext(userContext);
    const [selectedId, setSelectedId] = useState(-1);

    const [TestValue, setTestValue] = useState(0);

    const newChat = () => {
        axios
            .get("https://chat-app-new.herokuapp.com/getId", {
                params: { username: username },
            })
            .then((r) => {
                if (r.data != "no results") {
                    const id2 = r.data;
                    axios
                        .post("https://chat-app-new.herokuapp.com/addChat", {
                            user1: curId,
                            user2: id2,
                        })
                        .then((response) => {
                            if (response.data === "success") {
                                // console.log("chat Created");
                                axios
                                    .get("https://chat-app-new.herokuapp.com/allChats", {
                                        params: { user: curId },
                                    })
                                    .then((response2) => {
                                        // response.data.result.map((r) => console.log(`chat:${r}\n`));
                                        // console.log(response.data.result);
                                        setChats(response2.data.result);
                                    });
                            } else {
                                if ((response.data = "error")) {
                                    console.log("user couldn't be found");
                                }
                            }
                            // console.log(response.data);
                        });
                }
            });
    };
    useEffect(() => {
        // console.log("hello");
        if (curId === 0) navigate("/");
        else
            axios
                .get("https://chat-app-new.herokuapp.com/allChats", {
                    params: { user: curId },
                })
                .then((response) => {
                    console.log(response.data.result);
                    setChats(response.data.result);
                    response.data.result.map((r) => {
                        if (selectedId !== r.chat_id)
                            socket.emit("join-notification-room", r.chat_id);
                        console.log(r.chat_id);
                    });
                    // console.log(newMsgArray);
                });
        socket.on("trigger-notification", (chat_id) => {
            if (selectedId !== parseInt(chat_id))
                setNewMsgArray([...newMsgArray, parseInt(chat_id)]);
        });
    }, []);
    return (
        <div className="container">
            <div className="contentContainer">
                <div className="chatListContainer">
                    {chats.map((r) => (
                        <div
                            key={r.chat_id}
                            className={
                                selectedId === r.chat_id
                                    ? "singleChatContainer selected"
                                    : "singleChatContainer"
                            }
                            onClick={() => {
                                setSelectedId(r.chat_id);
                                setNewMsgArray(
                                    newMsgArray.filter(
                                        (item) => item !== r.chat_id
                                    )
                                );
                                console.log("removed");
                                navigate(`${r.chat_id}`);
                            }}
                        >
                            chat with {r.otherUser}
                            {newMsgArray.includes(r.chat_id) ? (
                                <div className="notification">new messages</div>
                            ) : (
                                <div className="notification"></div>
                            )}
                        </div>
                    ))}
                    <div className="newchatForm">
                        <input
                            className="chatAddInput"
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                            placeholder="start a new chat "
                        ></input>
                        <div
                            className="newChatBtn"
                            onClick={() => {
                                if (username !== curId) newChat();
                            }}
                        >
                            +
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
