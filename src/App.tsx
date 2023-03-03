import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from "uuid";

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
            {id: todolistID1, title: 'What to learn', filter: 'all'},  //все та переменная вместо значения id
            {id: todolistID2, title: 'What to buy', filter: 'all'},
        ]
    );
    const [tasks, setTasks] = useState({
        [todolistID1]: [                                               //ключ обьекта это и есть та переменная с id
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
        let todolistTasks = tasks[todoListId] ;                       //достаем нужный массив из обьекта по id
        tasks[todoListId] = todolistTasks
            .filter(t => t.id !== id)                                 //фильтруем массив по полученному id
        setTasks({...tasks})                                    //сетаем обратно копию отфильтрованного массива
    }

    function addTask(title: string, todoListId: string) {
        let task = {id: v1(), title: title, isDone: false};           //новый обьект в который записали title
        tasks[todoListId] = [task, ...tasks[todoListId]]              //в конкретную таску записываем таску и копию всех предыдущих
        setTasks({...tasks})                                    //сетим копию всего обьекта tasks
    }

    const onChangeStatusChecked = (taskId: string, newIsDone: boolean, todoListId: string) => {
        setTasks({...tasks, [todoListId]: tasks[todoListId]
                .map(el => el.id ===  taskId ? {...el, isDone: newIsDone } : el) })

    }

    const removeTodolist = (todoListId: string) => {
        setTodolists(todoLists.filter(td => td.id !== todoListId))
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todoLists.find(f => f.id === todolistId)
        if(todolist) {
            todolist.filter = value
            setTodolists([...todoLists])
        }
    }

    return (
        <div className="App">
            {
                todoLists.map(todolist =>   {
                    let tasksForTodolist = tasks[todolist.id];

                    if (todolist.filter === "active") {
                        tasksForTodolist = tasks[todolist.id].filter(t => !t.isDone );
                    }
                    if (todolist.filter === "completed") {
                        tasksForTodolist = tasks[todolist.id].filter(t => t.isDone );
                    }
                    return (
                        <Todolist key={todolist.id}
                                  title={todolist.title}
                                  id={todolist.id}
                                  tasks={tasksForTodolist}
                                  removeTask={removeTask}
                                  changeFilter={changeFilter}
                                  addTask={addTask}
                                  onChangeStatusChecked={onChangeStatusChecked}
                                  removeTodolist={removeTodolist}
                                  filter={todolist.filter}/>
                    )}
                )
            }
        </div>
    );
}

export default App;
