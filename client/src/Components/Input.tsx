import { TextField } from "@mui/material"

interface Props {
  label: string,
  type: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input(props: Props) {
  return (
    <TextField
      label={props.label}
      onChange={props.onChange}
      type={props.type}
      required
      variant="outlined"
      color="secondary"
      sx={{ mb: 3 }}
      fullWidth
      value={props.value}
    />
  )
}

export default Input;
