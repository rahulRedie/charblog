import "./App.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import socket from "./socket";

export const userContext = React.createContext("none");
function App() {
    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }, []);
    const [curId, setCurId] = useState(0);
    const value = [curId, setCurId];
    const navigate = useNavigate();
    // const curUser = useContext(userContext);
    let userMsg;
    const logout = () => {
        setCurId(0);
        navigate("/");
    };
    if (curId === 0) {
        userMsg = (
            <div className="userBtn">
                <Link to="/register" className="userInfo">
                    register
                </Link>
                <Link to="/login" className="userInfo">
                    login
                </Link>
            </div>
        );
    } else {
        userMsg = (
            <div className="userBtn">
                <div onClick={logout}>logout</div>
            </div>
        );
    }
    return (
        <userContext.Provider value={value}>
            <div className="App">
                <header className="headerBar">
                    <div className="logo">
                        logo
                    </div>
                    {userMsg}
                </header>
                <Outlet />
            </div>
        </userContext.Provider>
    );
}

export default App;
