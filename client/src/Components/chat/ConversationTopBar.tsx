import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import arrowBack from "../../assets/arrow-back.svg";
import { useMobileWindowInfo, useSelectedUserID } from "../../pages/Chat";
import { api } from "../../main";
import { ChatUser } from "../../types/user";
import { getProfilePicURL } from "../../utils/requests";

function ConversationTopBar() {
  const { isWindowMobile, setConversationVisible } = useMobileWindowInfo();
  const { selectedUserID } = useSelectedUserID();
  const [selectedUser, setSelectedUser] = useState<ChatUser>();
  const topBarHeightPx = 60;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get(`/api/users/get-by-id/${selectedUserID}`);
        const pfpID = res.data.user.profilePicture;
        const pfpURL = pfpID ? await getProfilePicURL(pfpID) : "";
        setSelectedUser({
          ...res.data.user,
          profilePictureURL: pfpURL,
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [selectedUserID]);

  const handleArrowClick = () => {
    setConversationVisible(false);
  };

  return (
    <Paper elevation={3} sx={{ height: topBarHeightPx, display: "flex" }}>
      {isWindowMobile && (
        <>
          <Box sx={{ height: topBarHeightPx, display: "flex" }}>
            <img
              src={arrowBack}
              alt=""
              width={topBarHeightPx - 10}
              style={{
                margin: "auto 0",
                cursor: "pointer",
                transform: "none",
                direction: "ltr",
              }}
              onClick={handleArrowClick}
            />
          </Box>
          <Avatar
            src={selectedUser?.profilePictureURL}
            sx={{ width: 60, height: 60 }}
          />
        </>
      )}
      <Box
        sx={{
          ml: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography>{selectedUser?.fullName}</Typography>
        <Typography sx={{ fontWeight: 100, fontSize: 16, color: "#ccc" }}>
          @{selectedUser?.username}
        </Typography>
      </Box>
    </Paper>
  );
}

export default ConversationTopBar;
