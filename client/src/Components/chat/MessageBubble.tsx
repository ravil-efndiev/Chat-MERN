import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  text: string;
  isSender: boolean;
  createdAt: string;
}

function MessageBubble({ text, isSender, createdAt }: Props) {
  const [createTime, setCreateTime] = useState("");
  useEffect(() => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    setCreateTime(
      `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
    );
  }, [createdAt]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isSender ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: isSender ? "#3f51b5" : "#40404f",
          color: "#fff",
          alignSelf: "flex-start",
          textAlign: isSender ? "right" : "left",
        }}
      >
        <Typography>{text}</Typography>
        <Typography sx={{color: "#dadada", fontSize: 12}}>{createTime}</Typography>
      </Box>
    </Box>
  );
}

export default MessageBubble;
