import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../authentication/AuthProvider";
import ProfilePictureUpload from "../ProfilePictureUpload";
import Input from "../Input";
import useFormValues from "../../hooks/useFormValues";
import { getProfilePicURL } from "../../utils/requests";
import { useNavigate } from "react-router-dom";
import { api } from "../../main";

interface Props {
  open: boolean;
  onClose: () => void;
}

function ProfileDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [previousPfpURL, setPreviousPfpURL] = useState<string | undefined>();
  const [newPfp, setNewPfp] = useState<File | null>(null);
  const { formValues, handleInputChange, resetForm } = useFormValues({
    username: "",
    fullName: "",
  });

  useEffect(() => {
    if (currentUser?.profilePicture) {
      getProfilePicURL(currentUser.profilePicture)
        .then((url) => {
          setPreviousPfpURL(url);
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  const handleProfileUpdate = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    if (formValues.username !== "") formData.append("username", formValues.username);
    if (formValues.fullName !== "") formData.append("fullName", formValues.fullName);
    if (newPfp) formData.append("profilePicture", newPfp);

    api
      .post("/api/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status !== 304) {
          setCurrentUser(res.data.user);
        }
        setServerError(null);
      })
      .catch((error) => {
        setServerError(error.response.data.error);
      })
      .finally(() => {
        resetForm();
        setNewPfp(null);
      });
  };

  const handleLogout = () => {
    api
      .post(
        "/api/auth/logout", {},
      )
      .then(() => {
        navigate("/login");
      });
  };

  return (
    <SwipeableDrawer
      open={open}
      onClose={() => {
        resetForm();
        setNewPfp(null);
        onClose();
      }}
      onOpen={() => {}}
      disableSwipeToOpen={true}
    >
      <Box sx={{ minWidth: {md: "20vw", xs: "50vw"}, py: 3 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Your Profile
        </Typography>
        <hr />
        <Typography sx={{ textAlign: "center", fontWeight: 300, mt: 3 }}>
          @{currentUser?.username}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {currentUser?.fullName}
        </Typography>
        <form
          style={{ maxWidth: "90%", margin: "0 auto" }}
          onSubmit={handleProfileUpdate}
        >
          <ProfilePictureUpload
            onFileChange={(file) => setNewPfp(file)}
            defaultPfpURL={previousPfpURL}
            customHeading=" "
            customSx={{ mb: 4 }}
          />
          <Input
            label="Change Full Name"
            onChange={handleInputChange("fullName")}
            value={formValues.fullName}
            required={false}
          />
          <Input
            label="Change Username"
            onChange={handleInputChange("username")}
            value={formValues.username}
            required={false}
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!formValues.username && !formValues.fullName && !newPfp}
          >
            Submit
          </Button>
          {serverError && (
            <Typography sx={{ color: "#b71d1d", mt: 2 }}>
              {serverError}
            </Typography>
          )}
        </form>
      </Box>
      <Button color="secondary" sx={{ mt: "auto" }} onClick={handleLogout}>
        Log Out
      </Button>
    </SwipeableDrawer>
  );
}

export default ProfileDrawer;
