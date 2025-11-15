import { Box, Button, TextField, Typography } from "@mui/material";
import { APIResponseMessage, ChatMessage } from "../../types/message";
import sendIcon from "../../assets/send-arrow.svg";
import { useEffect, useRef, useState, ReactNode } from "react";
import MessageBubble from "./MessageBubble";
import { useSocket } from "../SocketProvider";
import {
  useLastInteractedUserId,
  useMobileWindowInfo,
  useSelectedUserId,
} from "../../utils/contexts";
import ConversationTopBar from "./ConversationTopBar";
import { api } from "../../main";

interface Props {
  refreshChatList: () => void;
}

function Conversation({ refreshChatList }: Props) {
  type MessagesByDay = Map<string, ChatMessage[]>;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesByDay, setMessagesByDay] = useState<MessagesByDay>(new Map());
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const { setSelectedUserId: setSelectedUserID } = useSelectedUserId();
  const { isWindowMobile, isConversationVisible } = useMobileWindowInfo();
  const { selectedUserId: otherUserId } = useSelectedUserId();
  const { lastInteractedUserId, setLastInteractedUserId } =
    useLastInteractedUserId();

  useEffect(() => {
    if (!otherUserId || !socket) return;
    api
      .get(`/api/messages/get-all/${otherUserId}`)
      .then((res) => {
        const formatted = formatMessages(res.data.messages);
        setMessages(formatted);
      })
      .catch(() => {
        setMessages([]);
      });

    const handleMessageRecieve = (msg: {
      senderID: string;
      message: APIResponseMessage;
    }) => {
      if (msg.senderID === otherUserId) {
        if (otherUserId !== lastInteractedUserId) {
          setLastInteractedUserId(otherUserId);
        }

        setMessages((prev) => {
          return formatMessages([...prev, msg.message]);
        });
      }
    };

    socket.on("message", handleMessageRecieve);

    return () => {
      socket.off("message", handleMessageRecieve);
    };
  }, [otherUserId, socket]);

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

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewMessage(event.target.value);
  };

  const handleMessageSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!otherUserId || !newMessage) return;

    if (otherUserId !== lastInteractedUserId) {
      setLastInteractedUserId(otherUserId);
    }

    api
      .post("/api/messages/send/", {
        message: newMessage,
        receiverID: otherUserId,
      })
      .then((res) => {
        if (messages.length <= 0) {
          setSelectedUserID(otherUserId);
        }
        setMessages((prev) => {
          if (prev.length === 0) {
            refreshChatList();
          }
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const currentYear = date.getFullYear() === now.getFullYear();

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (sameDay(date, now)) return "Today";

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (sameDay(date, yesterday)) return "Yesterday";

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      ...(currentYear ? {} : { year: "numeric" }),
    };

    return date.toLocaleDateString(undefined, options);
  };

  const chatPlaceholder = (text: string): React.ReactNode => (
    <Box
      sx={{
        flex: 1,
        display: isWindowMobile && !isConversationVisible ? "none" : "flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{ color: "#fff", textAlign: "center", width: "100%" }}
        variant="h6"
      >
        {text}
      </Typography>
    </Box>
  );

  const renderGroupedMessages = () => {
    let finalNode: ReactNode[] = [];
    messagesByDay.forEach((messages, day) => {
      finalNode.push(
        <div key={day}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: 150,
              mx: "auto",
              bgcolor: "#313131",
              borderRadius: 10,
              my: "7px",
            }}
          >
            <Typography sx={{ color: "#ffffffff", textAlign: "center" }}>
              {formatDate(day)}
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

  if (!otherUserId) return chatPlaceholder("Select someone to start chatting");

  return (
    <Box
      sx={{
        display: isWindowMobile && !isConversationVisible ? "none" : "flex",
        flex: 1,
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <ConversationTopBar />
      {messages.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            flex: 1,
            px: 4,
          }}
        >
          {renderGroupedMessages()}
          <div ref={lastMessageRef}></div>
        </Box>
      ) : (
        chatPlaceholder("No messages here yet")
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
            py: 2,
            cursor: "pointer",
            borderRadius: "50%",
          }}
          type="submit"
          color="secondary"
        >
          <img src={sendIcon} width={30} alt="send message arrow" />
        </Button>
      </form>
    </Box>
  );
}

export default Conversation;
