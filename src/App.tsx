import React, { useState } from 'react';
import './App.css';
import { TaskType, Todolist } from './Todolist';
import { v1 } from "uuid";
import { AddItemForm } from './AddItemForm ';
import { AppBar, Button, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';

export type FilterValuesType = "all" | "active" | "completed";

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
};
type TasksStateType = {
    [key: string]: Array<TaskType>                                      //типизация "ассоциативного массива"
}

function App() {
    let todolistID1 = v1()                                              //присваиваеи id переменным
    let todolistID2 = v1()

    const [todoLists, setTodolists] = useState<Array<TodoListType>>(
        [
            { id: todolistID1, title: 'What to learn', filter: 'all' },  //все та переменная вместо значения id
            { id: todolistID2, title: 'What to buy', filter: 'all' },
        ]
    );
    const [tasks, setTasks] = useState({
        [todolistID1]: [                                               //ключ обьекта это и есть та переменная с id
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false },

        ],
        [todolistID2]: [
            { id: v1(), title: 'Rest API', isDone: true },
            { id: v1(), title: 'GraphQL', isDone: false },
        ]
    })

    function removeTask(id: string, todoListId: string) {
        //более интересный способ
        setTasks({ ...tasks, [todoListId]: tasks[todoListId].filter(el => el.id !== id) });
    }

    function addTask(title: string, todoListId: string) {
        let task = { id: v1(), title: title, isDone: false };              //новый обьект в который записали title
        setTasks({ ...tasks, [todoListId]: [task, ...tasks[todoListId]] });
    }

    const onChangeStatusChecked = (taskId: string, newIsDone: boolean, todoListId: string) => {
        setTasks({
            ...tasks, [todoListId]: tasks[todoListId]
                .map(el => el.id === taskId ? { ...el, isDone: newIsDone } : el)
        })
    }

    const addTodolist = (value: string) => {
        const newTodolistId = v1();
        const newTodolist: TodoListType = { id: newTodolistId, title: value, filter: 'all' }
        setTodolists([newTodolist, ...todoLists]);
        setTasks({ ...tasks, [newTodolistId]: [] })                        //в новый тудулист закидываем пустой массив тасок 
    }

    const removeTodolist = (todoListId: string) => {
        setTodolists(todoLists.filter(td => td.id !== todoListId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todoLists.find(f => f.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todoLists])
        }
    }

    return (
        <Container fixed >

            <AppBar position="static">                                           
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            
            <Grid container padding={{padding: "20px 0"}}>
                <AddItemForm addItem={addTodolist} />
            </Grid>
            <Grid container spacing={3} >
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
                            <Grid item>
                                <Paper style={{padding: "10px"}} >
                                    <Todolist key={todolist.id}
                                    title={todolist.title}
                                    id={todolist.id}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    onChangeStatusChecked={onChangeStatusChecked}
                                    removeTodolist={removeTodolist}
                                    filter={todolist.filter} />
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

export default App;

// Container - общий контейнер
// Grid (container / item) - грид с типом контейнер или item
// св-во spacing - это отступ
// Paper - обрамление блока кода 
// Typography - заголовки