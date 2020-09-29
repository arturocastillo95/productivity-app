import React, {useState} from 'react'


export default function Form({ addToDo }) {
    const [value, setValue] = useState('')

    const handleCreate = e => {
        e.preventDefault();
        if (!value) return;
        addToDo(value);
        setValue('')
    }

    return (
        <form onSubmit={ handleCreate }>
            <div className="field has-addons has-addons-centered">
                <div className="control is-expanded">
                    <input 
                        type="text" 
                        className="input" 
                        value={value}
                        onChange={e => setValue(e.target.value)} 
                    />
                </div>
                <div className="control">
                    <button type="submit" className="button is-info">
                        Add task
                    </button>
                </div>
            </div>
        </form>
    )
}
