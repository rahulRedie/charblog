import axios from "axios";
import { useContext, useState } from "react";
import "../styles/login.css";
import { userContext } from "../App.js";
import { Link, redirect, useNavigate } from "react-router-dom";
import socket from "../socket";
// import { SHA256 } from "crypto-js";
import { hash } from "../cryptography";
// import {} from "crypto-js"

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loginErr, setLoginErr] = useState(false);
    const [curId, setCurId] = useContext(userContext);
    const navigate = useNavigate();
    // console.log(curUser);
    const logIn = () => {
        let enc_password = hash(password + userName).toString();
        axios
            .get("https://chat-app-new.herokuapp.com/verifyLogin", {
                params: { username: userName, password: enc_password },
            })
            .then((response) => {
                console.log(response.data);
                if (response.data !== "failure") {
                    console.log("success");
                    setCurId(response.data);
                    setLoginErr(false);
                    socket.auth = { curId };
                    socket.connect();
                    navigate("/chats");
                } else {
                    console.log("wrong password please try again");
                    setLoginErr(true);
                }
            });
        socket.on("connect", () => {
            console.log(socket.id);
        });
    };
    const logInBtn = () => {
        axios
            .get("https://chat-app-new.herokuapp.com/countByUserName", {
                params: { username: userName },
            })
            .then((response) => {
                if (response.data[0].nameCount === 1) {
                    logIn();
                } else {
                    console.log("username doesn't exist");
                    setLoginErr(true);
                }
            });
    };
    return (
        <div className="registerScreen">
            <div className="registerForm">
                <h1>log in</h1>
                <h2 className={`errorMsg ${loginErr ? "displayed" : ""}`}>
                    invalid username or password
                </h2>
                <label>user name:</label>
                <input
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label>password</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={logInBtn}>sign in</button>
            </div>
        </div>
    );
}
