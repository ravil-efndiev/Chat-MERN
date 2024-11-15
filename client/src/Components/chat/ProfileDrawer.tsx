import { Box, Button, Drawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../authentication/AuthProvider";
import ProfilePictureUpload from "../ProfilePictureUpload";
import axios from "axios";
import Input from "../Input";
import useFormValues from "../../hooks/useFormValues";

interface Props {
  open: boolean;
  onClose: () => void;
}

function ProfileDrawer({ open, onClose }: Props) {
  const { currentUser, setCurrentUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [previousPfpURL, setPreviousPfpURL] = useState<string | undefined>();
  const [newPfp, setNewPfp] = useState<File | null>();
  const { formValues, handleInputChange, resetForm } = useFormValues({
    username: "",
    fullName: "",
  });

  useEffect(() => {
    if (currentUser?.profilePicture) {
      axios
        .get(
          `http://localhost:3000/api/users/profile-picture/${currentUser.profilePicture}`,
          {
            responseType: "blob",
            withCredentials: true,
          }
        )
        .then((res) => {
          setPreviousPfpURL(URL.createObjectURL(res.data));
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

    axios
      .post("http://localhost:3000/api/users/update", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status !== 304) {
          setCurrentUser(res.data.user);
        }
        setServerError(null);
        resetForm();
      })
      .catch((error) => {
        setServerError(error.response.data.error);
      });
  };

  return (
    <Drawer open={open} onClose={() => onClose()}>
      <Box sx={{ minWidth: "20vw", py: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Your Profile
        </Typography>
        <hr />
        <Typography sx={{ textAlign: "center", fontWeight: 300, mt: 3 }}>
          @{currentUser?.username}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {currentUser?.fullName}
        </Typography>
        <form style={{maxWidth:"90%", margin: "0 auto"}} onSubmit={handleProfileUpdate}>
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
    </Drawer>
  );
}

export default ProfileDrawer;
