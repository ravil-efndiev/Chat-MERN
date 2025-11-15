import { TextField } from "@mui/material";

interface Props {
  label: string;
  type?: string;
  value: string;
  width?: number | string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ label, type, value, width, required, onChange }: Props) {
  return (
    <TextField
      label={label}
      onChange={onChange}
      type={type || "text"}
      required={required !== undefined ? required : true}
      variant="outlined"
      color="secondary"
      sx={{ mb: 3, width: width || "100%", mx: "auto", display: "flex" }}
      value={value}
    />
  );
}

export default Input;
