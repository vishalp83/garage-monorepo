import TextField from "@mui/material/TextField";

/* eslint-disable-next-line */
export interface WTextFieldProps {}

export function WTextField(props: WTextFieldProps) {
  return (
    <TextField
      required
      id="outlined-required"
      label="Required"
      defaultValue="Hello World"
    />
  );
}

export default WTextField;
