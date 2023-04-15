import "../styles/register.css";
import { useContext, useState } from "react";
import axios from "axios";
import { userContext } from "../App.js";
import { useNavigate } from "react-router-dom";
import { encrypt, hash } from "../cryptography";
export default function Register() {
    const [curId, setCurId] = useContext(userContext);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [registerErr, setRegisterErr] = useState(false);
    const submitBtn = () => {
        axios
            .get("https://chat-app-new.herokuapp.com/countByUserName", {
                params: { username: userName },
            })
            .then((response) => {
                if (response.data[0].nameCount === 0) {
                    submitInfo();
                } else {
                    setRegisterErr(true);
                }
            });
    };
    const submitInfo = () => {
        console.log(`user name:${userName} password: ${password}`);
        let enc_password = hash(password + userName).toString();
        console.log(`enc: ${enc_password}`);
        axios
            .post("https://chat-app-new.herokuapp.com/addUser", {
                username: userName,
                password: enc_password,
            })
            // .then(console.log(`user - ${userName} was registered`));
            .then((response) => {
                axios
                    .get("https://chat-app-new.herokuapp.com/getId", {
                        params: { username: userName },
                    })
                    .then((r) => {
                        setCurId(r.data);
                        navigate("/chats");
                    });
            });
    };
    return (
        <div className="registerScreen">
            <div className="registerForm">
                <h1>Register</h1>
                <h2 className={`errorMsg ${registerErr ? "displayed" : ""}`}>
                    username already exist, please pick another one
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
                <button onClick={submitBtn}>register</button>
            </div>
        </div>
    );
}
