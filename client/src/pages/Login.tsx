import { useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import FormWrapper from "../Components/FormWrapper";
import Input from "../Components/Input";
import useFormValues from "../hooks/useFormValues";
import { useAuth } from "../Components/authentication/AuthProvider";

function Login() {
  const { formValues, handleInputChange } = useFormValues({
    username: "",
    password: "",
  });

  const [serverError, setServerError] = useState<string | null>();
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          username: formValues.username,
          password: formValues.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setCurrentUser(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setServerError(error.response.data.error);
      });
  };

  return (
    <FormWrapper width="30%">
      <form onSubmit={handleFormSubmit}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
          Log into your accout
        </Typography>
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
          Log In
        </Button>
      </form>
      <Typography sx={{ fontWeight: 100, fontSize: 14, mt: 4 }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Typography>
      {serverError && <Typography>{serverError}</Typography>}
    </FormWrapper>
  );
}

export default Login;
