import { ChatUser } from "../../types/user";
import { Avatar, Box, Typography } from "@mui/material";

interface Props {
  user: ChatUser;
  showProfilePic?: boolean;
}

function UserDisplay({ user, showProfilePic = true }: Props) {
  return (
    <>
      {showProfilePic && (
        <Avatar src={user.profilePictureURL} sx={{ width: 60, height: 60 }} />
      )}
      <Box
        sx={{
          ml: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography>{user.fullName}</Typography>
        <Typography sx={{ fontWeight: 100, fontSize: 16, color: "#ccc" }}>
          @{user.username}
        </Typography>
      </Box>
    </>
  );
}

export default UserDisplay;
