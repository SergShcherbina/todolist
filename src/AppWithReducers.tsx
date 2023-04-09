import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from "uuid";
import {AddItemForm} from './AddItemForm ';
import {AppBar, Button, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Container} from '@mui/system';
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./state/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTasksAC, tasksReducer} from "./state/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
};
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export function AppWithReducers() {
    let todolistID1 = v1()
    let todolistID2 = v1()

    const [todoLists, dispatchToTodo] = useReducer ( todolistsReducer, [
            {id: todolistID1, title: 'What to learn', filter: 'all'},
            {id: todolistID2, title: 'What to buy', filter: 'all'},
        ]
    );
    const [tasks, dispatchToTasks] = useReducer (tasksReducer, {
        [todolistID1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: 'Rest API', isDone: true},
            {id: v1(), title: 'GraphQL', isDone: false},
        ]
    })

    function removeTask(id: string, todoListId: string) {
        //диспатчим результат вызова э-крейтера в соответствуюший редюсер
        dispatchToTasks(removeTasksAC(todoListId, id))
    }

    function addTask(title: string, todoListId: string) {
        dispatchToTasks(addTaskAC(title, todoListId))
    }

    const onChangeStatusChecked = (taskId: string, newIsDone: boolean, todoListId: string) => {
        dispatchToTasks(changeTaskStatusAC(todoListId, taskId, newIsDone))
    }

    const changeTitleTask = (todoListId: string, taskId: string, newTitle: string) => {
        dispatchToTasks(changeTaskTitleAC(todoListId, taskId, newTitle))
    }

    const addTodolist = (value: string) => {
        //формируем общий action в котором единый id
        const action = AddTodolistAC(value)
        dispatchToTodo(action)
        dispatchToTasks(action)
    }

    const removeTodolist = (todoListId: string) => {
        dispatchToTodo(RemoveTodolistAC(todoListId))
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        dispatchToTodo(ChangeTodolistFilterAC(todoListId, value))
    }

    const onChangeTitleTodolist = (todoListId: string, newTitle: string) => {
        dispatchToTodo(ChangeTodolistTitleAC(todoListId, newTitle))
    }

    return (
        <Container fixed>

            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Grid container padding={{padding: "20px 0"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todoLists.map(todolist => {
                            let tasksForTodolist = tasks[todolist.id];

                            if (todolist.filter === "active") {
                                tasksForTodolist = tasks[todolist.id].filter(t => !t.isDone);
                            }
                            if (todolist.filter === "completed") {
                                tasksForTodolist = tasks[todolist.id].filter(t => t.isDone);
                            }
                            return (
                                <Grid item key={todolist.id}>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist key={todolist.id}
                                                  title={todolist.title}
                                                  id={todolist.id}
                                                  tasks={tasksForTodolist}
                                                  removeTask={removeTask}
                                                  changeFilter={changeFilter}
                                                  addTask={addTask}
                                                  onChangeStatusChecked={onChangeStatusChecked}
                                                  removeTodolist={removeTodolist}
                                                  filter={todolist.filter}
                                                  onChangeTitleTodolist={onChangeTitleTodolist}
                                                  changeTitle={changeTitleTask}/>
                                    </Paper>
                                </Grid>
                            )
                        }
                    )
                }
            </Grid>
        </Container>
    );
}


// Container - общий контейнер
// Grid (container / item) - грид с типом контейнер или item
// св-во spacing - это отступ
// Paper - обрамление блока кода 
// Typography - заголовки