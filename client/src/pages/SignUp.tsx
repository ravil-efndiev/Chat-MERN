import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../Components/AuthProvider";
import useFormValues from "../hooks/useFormValues";
import FormWrapper from "../Components/FormWrapper";
import Input from "../Components/Input";

function SignUp() {
  const { formValues, handleInputChange } = useFormValues({
    username: "",
    fullName: "",
    password: "",
  });

  const [serverError, setServerError] = useState<string | null>();
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/auth/register",
        {
          username: formValues.username,
          fullName: formValues.fullName,
          password: formValues.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setCurrentUser({
          id: res.data.id,
          fullName: res.data.fullName,
          username: res.data.username,
          profilePicture: res.data.profilePicture,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setServerError(error.response.data.error);
      });
  };

  return (
    <FormWrapper>
      <form onSubmit={handleFormSubmit}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
          Create an Account
        </Typography>
        <Input
          type="text"
          label="Your Name"
          onChange={handleInputChange("fullName")}
          value={formValues.fullName}
        />
        <Input
          label="Username"
          type="text"
          onChange={handleInputChange("username")}
          value={formValues.username}
        />
        <Input
          label="Password"
          type="password"
          onChange={handleInputChange("password")}
          value={formValues.password}
        />
        <Button variant="contained" color="secondary" type="submit">
          Sign Up
        </Button>
      </form>
      {serverError && <Typography>{serverError}</Typography>}
    </FormWrapper>
  );
}

export default SignUp;
