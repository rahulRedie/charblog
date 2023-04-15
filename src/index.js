import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/login";
import Register from "./routes/register";
import HomePage from "./routes/homePage";
import Chat from "./routes/chat";
import ChatAddForm from "./routes/addChat";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />} />
                <Route path="/chats" element={<ChatAddForm />}>
                    <Route path=":chatId" element={<Chat />} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
