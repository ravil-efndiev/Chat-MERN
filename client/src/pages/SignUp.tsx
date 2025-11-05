import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../Components/authentication/AuthProvider";
import useFormValues from "../hooks/useFormValues";
import FormWrapper from "../Components/FormWrapper";
import Input from "../Components/Input";
import ProfilePictureUpload from "../Components/ProfilePictureUpload";
import { api } from "../main";

function SignUp() {
  const { formValues, handleInputChange } = useFormValues({
    username: "",
    fullName: "",
    password: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>();

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);
    formData.append("fullName", formValues.fullName);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    api
      .post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setCurrentUser(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        setServerError(error.response.data.error);
      });
  };

  return (
    <FormWrapper width={{ lg: "45%", md: "70%", sm: "80%", xs: "80%" }}>
      <form onSubmit={handleFormSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", sm: "column", xs: "column" },
            alignItems: { md: "baseline", sm: "center", xs: "center" },
            gap: 5,
          }}
        >
          <Box sx={{ width: { md: "55%", sm: "70%", xs: "90%" } }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
              Create an Account
            </Typography>
            <Input
              label="Your Name"
              onChange={handleInputChange("fullName")}
              value={formValues.fullName}
            />
            <Input
              label="Username"
              onChange={handleInputChange("username")}
              value={formValues.username}
            />
            <Input
              label="Password"
              type="password"
              onChange={handleInputChange("password")}
              value={formValues.password}
            />
          </Box>
          <ProfilePictureUpload
            width={{md: "45%", sm: "70%", xs: "70%"}}
            onFileChange={(file) => setProfilePicture(file)}
          />
        </Box>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          sx={{
            display: { md: "block", sm: "flex", xs: "flex" },
            margin: { md: "0", sm: "0 auto", xs: "0 auto" },
          }}
        >
          Sign Up
        </Button>
      </form>
      <Typography sx={{ fontWeight: 100, fontSize: 14, mt: 4 }}>
        Already have an account? <Link to="/login">Log In</Link>
      </Typography>
      {serverError && (
        <Typography sx={{ color: "#b71d1d" }}>{serverError}</Typography>
      )}
    </FormWrapper>
  );
}

export default SignUp;
