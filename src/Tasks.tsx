
type TasksType = {
    data: {
        title: string,
        tasks: Array<TasksArr>,
        students: Array<string>,
        }
};
type TasksArr = {
        taskId: number,
        title: string,
        isDone: boolean
}

export const Tasks = (props: TasksType) => {
    debugger
    return (
        <div>
            <h2>{props.data.title}</h2>

            {props.data.tasks.map((el, i) =>
                <>
                    <input id={`${i}`}
                           type="checkbox"
                           checked={el.isDone}/> <label htmlFor={`${i}`}> {el.title}</label>
                    <br/>
                </> )}

            <ol>
                {props.data.students.map((el, i )=> <li key={i}>{el}</li>)}
            </ol>
        </div>
    )
}
