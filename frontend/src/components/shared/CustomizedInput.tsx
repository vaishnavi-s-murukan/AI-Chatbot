import React from "react";
import TextField from "@mui/material/TextField";

type Props = {
  name: string;
  type: string;
  label: string;
};

const CustomizedInput = (props: Props) => {
  return (
    <TextField
      name={props.name}
      label={props.label}
      type={props.type}
      sx={{
        marginBottom: "20px", // Adds space between fields
        "& label": { color: "white" }, // Style label color
        "& input": {
          width: "400px",
          borderRadius: 10,
          fontSize: 20,
          color: "white",
        },
      }}
    />
  );
};

export default CustomizedInput;
