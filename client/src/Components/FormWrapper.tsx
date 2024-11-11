import { Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

function FormWrapper({ children }: PropsWithChildren) {
  return (
    <Container>
      <Paper
        elevation={7}
        sx={{
          p: 3,
          width: "35%",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </Paper>
    </Container>
  );
}

export default FormWrapper;
