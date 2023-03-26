import { useState, ChangeEvent } from "react"

type EditableSpanType = {
    value: string
    onChange: (newValue: string) => void
}
export const EditableSpan = (props: EditableSpanType) =>  {

    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(props.value)

    const onDubleClickHandler = () => {
        setEditMode(true)
    }
    const onBlurHandler = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const onChangeHandler = (e : ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode 
        ? <input 
            autoFocus={true}
            onBlur={onBlurHandler}
            value={title}
            onChange={onChangeHandler}/>
        : <span
            onClick={onDubleClickHandler}
            // onDoubleClick={()=>console.log("hi")}
        >{props.value}</span>
    )
}