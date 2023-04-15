import { useContext } from "react";
import { userContext } from "../App.js";
import { Link } from "react-router-dom";
import "../styles/homePage.css";
import NewChatComponent from "./addChat.js";

export default function HomePage() {
    const [curId, setCurId] = useContext(userContext);

    let msg;
    if (curId === 0) {
        // if (false) {

        msg = (
            <div className="msg">
                welcome to chat-app in order to continue you need to{" "}
                <Link to="/register" className="userLink">
                    register
                </Link>{" "}
                or{" "}
                <Link to="/login" className="userLink">
                    sign in
                </Link>
            </div>
        );
    }
    return <div className="msgContainer">{msg}</div>;
}
