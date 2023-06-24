import React from "react";
import { Button } from "@mui/material";
import { FilterValuesType } from "../Todolist";

type PropsButtonFilterType = {
  variant: "outlined" | "text";
  onClick: (filter: FilterValuesType) => void;
  color: "inherit" | "primary" | "secondary";
  title: FilterValuesType;
};

export const FilterButton = React.memo((props: PropsButtonFilterType) => {
  const { variant, onClick, color, title } = props;
  return (
    <Button variant={variant} onClick={() => onClick(title)} color={color}>
      {props.title}
    </Button>
  );
});
