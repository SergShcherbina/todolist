import { ChangeEvent, KeyboardEvent, useState } from "react"

type AddItemFormType = {
    addItem: (value: string) => void
}

export const AddItemForm = (props: AddItemFormType) => {
    let [newTitle, setNewTitle] = useState("")
    let [error, setError] = useState('')

    const addItem = () => {
        if(newTitle.trim() === '') {                                                   //записываем ошибку если отправляем пустой инпут
            setError('Title is required')
            return;
        } else {
            props.addItem(newTitle.trim());
            setNewTitle("");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
        setError('')
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {                                                    //поведение при нажатии на ввод
            addItem();
        }
    }

    return (
        <div>
            <input value={newTitle}
                onChange={ onChangeHandler }
                onKeyPress={ onKeyPressHandler }
                className={error ? "error" : ''}
            />
            <button onClick={addItem}
                    disabled={ !newTitle  }>+</button>
            { error ? <div className={'error-message'}> {error} </div> : null}
        </div>        
    )
}
