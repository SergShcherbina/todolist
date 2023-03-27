import {v1} from "uuid";
import {
    ActionsType, AddTodolistAC, ChangeTodolistFilterAC,
    ChangeTodolistFilterAT, ChangeTodolistTitleAC,
    ChangeTodolistTitleAT, RemoveTodolistAC,
    RemoveTodolistAT,
    todolistsReducer
} from "./todolist-reducer";
import {FilterValuesType, TodoListType} from "../App";

test('correct todolist should be remove', () => {
    let todolistID1 = v1()                                              //присваиваеи id переменным
    let todolistID2 = v1()

    const startState: Array<TodoListType> = [
        {id: todolistID1, title: 'What to learn', filter: 'all'},     //все та переменная вместо значения id
        {id: todolistID2, title: 'What to buy', filter: 'all'},
    ]
    // const action: RemoveTodolistAT = {                               //формируем action в actionCreater - RemoveTodolistAC
    //     type: 'REMOVE_TODOLIST',
    //     id: todolistID1
    // }
    const endState = todolistsReducer(startState, RemoveTodolistAC(todolistID1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistID2)
})

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to buy', filter: 'all'}
    ]

    const endState = todolistsReducer(startState, AddTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
})
test('correct todolist should change its name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to buy', filter: 'all'}
    ]

    // const action:ChangeTodolistTitleAT = {
    //     type: 'CHANGE-TODOLIST-TITLE',
    //     id: todolistId2,
    //     title: newTodolistTitle
    // }

    const endState = todolistsReducer(startState, ChangeTodolistTitleAC(todolistId2, newTodolistTitle))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})
test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newFilter: FilterValuesType = 'completed'

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to buy', filter: 'all'}
    ]

    // const action:ChangeTodolistFilterAT = {
    //     type: 'CHANGE-TODOLIST-FILTER',
    //     id: todolistId2,
    //     filter: newFilter
    // }

    const endState = todolistsReducer(startState, ChangeTodolistFilterAC(todolistId2, newFilter))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})
