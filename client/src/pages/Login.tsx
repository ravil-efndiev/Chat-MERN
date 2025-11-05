import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import FormWrapper from "../Components/FormWrapper";
import Input from "../Components/Input";
import useFormValues from "../hooks/useFormValues";
import { useAuth } from "../Components/authentication/AuthProvider";
import { api } from "../main";

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

    api
      .post("/api/auth/login", {
        username: formValues.username,
        password: formValues.password,
      })
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
    <FormWrapper width={{lg: "30%", md: "50%", sm: "70%", xs: "70%"}}>
      <form onSubmit={handleFormSubmit}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
          Log into your accout
        </Typography>
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
        <Button variant="contained" color="secondary" type="submit">
          Log In
        </Button>
      </form>
      <Typography sx={{ fontWeight: 100, fontSize: 14, mt: 4 }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </Typography>
      {serverError && (
        <Typography sx={{ color: "#b71d1d" }}>{serverError}</Typography>
      )}
    </FormWrapper>
  );
}

export default Login;
