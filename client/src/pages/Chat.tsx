import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../Components/AuthProvider";
import Sidebar from "../Components/Sidebar"
import { useState } from "react";
import { APIRespondMessage } from "../types/message";

function Chat() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<APIRespondMessage[]>([]);

  const handleLogoutClick = () => {
    axios
      .post(
        "http://localhost:3000/api/auth/logout", {},
        { withCredentials: true }
      )
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const hadnleMessageSend = () => {
    axios
      .post("http://localhost:3000/api/messages/send", {
        message: msg,
        receiverID: "6731f12e8fc1e53cf5162276",
      }, { withCredentials: true })
  }

  const handleUserSelected = (id: string) => {
    axios
    .get(`http://localhost:3000/api/messages/get-all/${id}`, { withCredentials: true })
    .then((res) => {
      setMessages(res.data.messages);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar userClicked={handleUserSelected}/>
      <Box sx={{ flex: 1 }}>
        <Typography>{currentUser?.username}</Typography>
        <Typography>{currentUser?.fullName}</Typography>
        <Button color="secondary" variant="contained" onClick={handleLogoutClick}>
          Log Out
        </Button>
        <input type="text" onChange={(e) => setMsg(e.target.value)} />
        <Button color="secondary" variant="contained" onClick={hadnleMessageSend}>
          Send
        </Button>
        <div>
          {messages.map(msg => (
            <Paper sx={{ bgcolor: msg.writtenByMe ? "#323299" : "#323232"}}>{msg.message}</Paper>
          ))} 
        </div>
      </Box>
    </Box>
  );
}

export default Chat;
