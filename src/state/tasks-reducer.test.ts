import {v1} from "uuid";
import {
    tasksReducer,
    addTaskAC,
    changeTaskStatusAC, changeTaskTitleAC,
    removeTasksAC,
} from "./tasks-reducer";
import {TasksStateType} from "../App";
import {AddTodolistAC, RemoveTodolistAC} from "./todolist-reducer";

let startState: TasksStateType;

beforeEach(() => {
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false}
        ]
    }
})

test('correct task should be added to correct array', () => {

    const action = addTaskAC('juce', 'todolistId2')
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].isDone).toBe(false)
})
test('correct task should be remove from correct array', () => {

    const action = removeTasksAC('todolistId2', '2')
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', isDone: false},
            {id: '3', title: 'tea', isDone: false}
        ]
    })

})
test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('todolistId2', '2', false,)
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].isDone).toBe(false)
    expect(endState['todolistId1'][1].isDone).toBe(true)
})
test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('todolistId2', '2', 'NEW TITLE')
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('NEW TITLE')
    expect(endState['todolistId1'][1].title).toBe('JS')
})

//тесты для этого reduser, но другие AC и AT
test('new array should be added when new todolist is added', () => {

    const action = AddTodolistAC('new todolist')
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {

    const action = RemoveTodolistAC('todolistId2')
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})


