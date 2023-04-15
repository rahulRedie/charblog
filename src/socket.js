import { io } from "socket.io-client";

const URL = "https://chat-app-new.herokuapp.com";
const socket = io(URL, { autoConnect: false });

export default socket;
