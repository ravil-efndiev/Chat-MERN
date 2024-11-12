import { Box, Button, TextField, Typography } from "@mui/material";
import { APIResponseMessage } from "../types/message";
import sendIcon from "../assets/send-arrow.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { APIResponseUser } from "../types/user";
import MessageBubble from "./MessageBubble";

interface Props {
  with: string;
}

function Conversation({ with: otherUserID }: Props) {
  const [messages, setMessages] = useState<APIResponseMessage[]>([]);
  const [otherUser, setOtherUser] = useState<APIResponseUser | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log(otherUserID);
    const getUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/get-by-id/${otherUserID}`,
          {
            withCredentials: true,
          }
        );
        setOtherUser(res.data.user);
      } catch (err) {
        setOtherUser(null);
        setMessages([]);
      }
    };

    const getMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/messages/get-all/${otherUserID}`,
          {
            withCredentials: true,
          }
        );
        setMessages(res.data.messages);
      } catch (err) {
        setMessages([]);
      }
    };

    getUser();
    getMessages();
  }, [otherUserID]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleMessageSend = (event: React.FormEvent) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/api/messages/send/",
        {
          message: newMessage,
          receiverID: otherUserID,
        },
        { withCredentials: true }
      )
      .then(() => {
        setNewMessage("");
      });
  };

  if (!otherUser)
    return (
      <Box
        sx={{ height: "100vh", flex: 1, display: "flex", alignItems: "center" }}
      >
        <Typography
          sx={{ color: "#fff", textAlign: "center", width: "100%" }}
          variant="h6"
        >
          Select someone to start chatting
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          height: "calc(100% - 60px)",
          width: "95%",
          mx: "auto",
          overflow: "auto",
        }}
      >
        {otherUser?.fullName}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.message}
            isSender={msg.writtenByMe}
          />
        ))}
      </Box>
      <form className="chat-input-bar" onSubmit={handleMessageSend}>
        <TextField
          variant="standard"
          placeholder="Write a message..."
          color="secondary"
          sx={{ px: 4, width: "100%" }}
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
          onChange={handleMessageChange}
          value={newMessage}
        />
        <Button
          sx={{
            px: 2,
            cursor: "pointer",
            ":hover": { bgcolor: "#00000000" },
          }}
          type="submit"
        >
          <img src={sendIcon} width={30} alt="send message arrow" />
        </Button>
      </form>
    </Box>
  );
}

export default Conversation;
