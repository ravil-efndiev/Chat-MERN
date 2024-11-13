import { Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  width: string | number;
}

function FormWrapper({ width, children }: Props) {
  return (
    <Container>
      <Paper
        elevation={7}
        sx={{
          p: 3,
          width: width,
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
