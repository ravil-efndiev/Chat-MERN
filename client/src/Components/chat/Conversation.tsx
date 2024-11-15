import { Box, Button, TextField, Typography } from "@mui/material";
import { APIResponseMessage } from "../../types/message";
import sendIcon from "../../assets/send-arrow.svg";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ChatUser } from "../../types/user";
import MessageBubble from "./MessageBubble";

interface Props {
  with: ChatUser | null;
}

function Conversation({ with: otherUser }: Props) {
  const [messages, setMessages] = useState<APIResponseMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otherUser) return;
    axios
      .get(`http://localhost:3000/api/messages/get-all/${otherUser.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [otherUser]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
  };

  const handleMessageSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!otherUser) return;
    axios
      .post(
        "http://localhost:3000/api/messages/send/",
        {
          message: newMessage,
          receiverID: otherUser.id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          res.data.message,
        ]);
        setNewMessage("");
      })
      .catch((err) => {
        console.error(err);
      })
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleMessageSend(event as React.FormEvent);
    }
  }

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
    <Box sx={{ flex: 1, height: "100vh" }}>
      <Box
        sx={{
          height: `calc(100vh - 100px)`,
          width: "95%",
          mx: "auto",
          overflowY: "auto",
          flex: 1
        }}
      >
        {otherUser?.fullName}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.message}
            isSender={msg.writtenByMe}
            createdAt={msg.createdAt}
          />
        ))}
        <div ref={lastMessageRef}></div>
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
          multiline
          maxRows={3}
          onKeyDown={handleKeyDown}
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
