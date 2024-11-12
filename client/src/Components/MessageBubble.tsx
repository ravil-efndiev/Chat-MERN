import { Box, Typography } from "@mui/material";

interface Props {
  text: string,
  isSender: boolean,
}

function MessageBubble({ text, isSender }: Props) {
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
          backgroundColor: isSender ? "#3f51b5" : "#e0e0e0",
          color: isSender ? "#ffffff" : "#202020",
          alignSelf: "flex-start",
          textAlign: isSender ? "right" : "left",
        }}
      >
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
