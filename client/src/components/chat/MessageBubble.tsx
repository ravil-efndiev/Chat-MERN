import { Box, colors, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  text: ReactNode;
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
      `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }`
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
          bgcolor: "transparent",
          background: isSender
            ? `linear-gradient(to bottom right, ${colors.indigo[500]}, ${colors.deepPurple[400]})`
            : "#3a464dff",
          color: "#fff",
          alignSelf: "flex-start",
          textAlign: isSender ? "right" : "left",
        }}
      >
        {text}
        <Typography sx={{ color: "#dadada", fontSize: 12 }}>
          {createTime}
        </Typography>
      </Box>
    </Box>
  );
}

export default MessageBubble;
