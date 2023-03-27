import { useState, ChangeEvent } from "react"

type EditableSpanType = {
    value: string
    onChange: (newValue: string) => void
}
export const EditableSpan = (props: EditableSpanType) =>  {

    const [editMode, setEditMode] = useState(false)
    const [LocalTitle, setLocalTitle] = useState(props.value)

    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        props.onChange(LocalTitle)
    }
    const changeLocalTitle = (e : ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.currentTarget.value)
    }

    return (
        editMode 
        ? <input 
            autoFocus={true}
            onBlur={offEditMode}
            value={LocalTitle}
            onChange={changeLocalTitle}/>
        : <span
            onDoubleClick={onEditMode}
        >{props.value}</span>
    )
}