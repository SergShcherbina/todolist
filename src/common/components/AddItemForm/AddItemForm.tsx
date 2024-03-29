import TextField from "@mui/material/TextField/TextField";
import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { IconButton } from "@mui/material";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { TaskType } from "features/todolistList/tasks/api/task-api";
import { TodolistApiType } from "features/todolistList/todolist/api/todolist-api";
import { ResponseType } from "common/types/common-types";

type Props = {
  addItem: (
    title: string
  ) => Promise<{ todoId: string; task: TaskType }> | Promise<{ todo: TodolistApiType }> | Promise<ResponseType>;
  isDisabled?: boolean;
};

export const AddItemForm: FC<Props> = React.memo(({ addItem, isDisabled }) => {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<string | null>(null);

  const addItems = () => {
    if (title.trim() !== "") {
      addItem(title)
        .then((res) => {
          setTitle("");
        })
        .catch((err) => {
          setError(err.data.messages[0]);
        });
    } else {
      setError("Title is required");
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null);
    if (e.charCode === 13) {
      addItems();
    }
  };

  return (
    <div>
      <TextField
        variant="outlined"
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label="Title"
        helperText={error}
        disabled={isDisabled}
        sx={{
          background: "rgba(229,229,229,0.35)",
          boxShadow: "0 0 7px 3px #fff",
        }}
      />
      <IconButton color="primary" onClick={addItems} disabled={isDisabled}>
        <AddToPhotosIcon fontSize={"large"} sx={{ color: "#9d67f1" }} />
      </IconButton>
    </div>
  );
});
