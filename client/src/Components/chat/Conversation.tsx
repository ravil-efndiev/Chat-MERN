import { Box, Button, TextField, Typography } from "@mui/material";
import { APIResponseMessage, ChatMessage } from "../../types/message";
import sendIcon from "../../assets/send-arrow.svg";
import { useEffect, useRef, useState, ReactNode } from "react";
import axios from "axios";
import { ChatUser } from "../../types/user";
import MessageBubble from "./MessageBubble";
import { useSocket } from "../SocketProvider";

interface Props {
  with: ChatUser | null;
  onChatCreate: (userID: string) => void;
}

function Conversation({ with: otherUser, onChatCreate }: Props) {
  type MessagesByDay = Map<string, ChatMessage[]>;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesByDay, setMessagesByDay] = useState<MessagesByDay>(new Map());
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!otherUser) return;
    axios
      .get(`http://localhost:3000/api/messages/get-all/${otherUser.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const formatted = formatMessages(res.data.messages);
        setMessages(formatted);
      })
      .catch(() => {
        setMessages([]);
      });

    const handleMessageRecieve = (msg: { senderID: string, message: APIResponseMessage }) => {
      if (msg.senderID === otherUser.id) {
        setMessages((prev) => {
          return formatMessages([...prev, msg.message]);
        });
      }
    };

    socket?.on("message", handleMessageRecieve);

    return () => {
      socket?.off("message", handleMessageRecieve);
    };
  }, [otherUser, socket]);

  useEffect(() => {
    groupMessagesByDate();
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessages = (prev: ChatMessage[]) => {
    const formatted = prev.map((msg) => {
      if (msg.renderText) return msg;
      const text: ReactNode = msg.message
        .split("\n")
        .map((line, index) => <Typography key={index}>{line}</Typography>);

      return {
        ...msg,
        renderText: text,
      };
    });
    return formatted;
  };

  const groupMessagesByDate = () => {
    setMessagesByDay(new Map());
    messages.forEach((msg) => {
      const day = new Date(msg.createdAt).toISOString().split("T")[0];
      setMessagesByDay((prev) => {
        const newMessages = new Map(prev);
        if (!newMessages.has(day)) {
          newMessages.set(day, []);
        }

        newMessages.get(day)!.push(msg);
        return newMessages;
      });
    });
  };

  const renderGroupedMessages = () => {
    let finalNode: ReactNode[] = [];
    messagesByDay.forEach((messages, day) => {
      finalNode.push(
        <div key={day}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: 200,
              mx: "auto",
              bgcolor: "#313131",
              borderRadius: 10,
            }}
          >
            <Typography sx={{ color: "#ffffffaa", textAlign: "center" }}>
              {day}
            </Typography>
          </Box>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.renderText}
              isSender={msg.writtenByMe}
              createdAt={msg.createdAt}
            />
          ))}
        </div>
      );
    });

    return finalNode;
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
        if (messages.length <= 0) {
          onChatCreate(otherUser.id);
        }    
        setMessages((prev) => {
          const newMesssages = [...prev, res.data.message];
          return formatMessages(newMesssages);
        });
        setNewMessage("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleMessageSend(event as React.FormEvent);
    }
  };

  const chatPlaceholder = (text: string, fullHeight: boolean): React.ReactNode => (
    <Box
      sx={{ height: fullHeight ? "100vh" : "85vh", flex: 1, display: "flex", alignItems: "center" }}
    >
      <Typography
        sx={{ color: "#fff", textAlign: "center", width: "100%" }}
        variant="h6"
      >
        {text}
      </Typography>
    </Box>
  );

  if (!otherUser) return chatPlaceholder("Select someone to start chatting", true);

  return (
    <Box sx={{ flex: 1, height: "100vh" }}>
      {messages.length > 0 ? (
        <Box
          sx={{
            height: `calc(100vh - 100px)`,
            mx: "auto",
            px: 4,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {renderGroupedMessages()}
          <div ref={lastMessageRef}></div>
        </Box>
      ) : (
        chatPlaceholder("No messages here yet", false)
      )}
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
