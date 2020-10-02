import React, {useState} from 'react'

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export default function Form({ onTaskCreated }) {
    const [value, setValue] = useState({'title': '', 'duration': 1800, 'remaining': 1800})

    const handleCreate = e => {
        e.preventDefault();
        if (!value.title) return;
        
        var csrf_token = getCookie('csrftoken');

        fetch('http://127.0.0.1:8000/api/task-create/', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            'body': JSON.stringify(value)
        });
        onTaskCreated(value);
    }

    function setTaskName(name) {
        value.title = name;
        setValue(value);
    }

    function setTaskDuration(duration) {
        switch(duration) {
            default:
                value.duration = value.remaining = 1800;
                setValue(value);
                break;
            case 'Medium (1 hr)':
                value.duration = value.remaining = 3600;
                setValue(value);
                break;
            case 'Long (2 hrs)':
                value.duration = value.remaining = 7200;
                setValue(value);
                console.log(value)
                break;
        }
    }

    return (
        <form onSubmit={ handleCreate }>

            <h1 className="title is-3 has-text-centered">
                Create New Task
            </h1>

            <div className="field">
                <label className='label'>Task Name</label>
                <div className="control is-expanded">
                    <input
                        placeholder='Get stuff done!'
                        type="text" 
                        className="input" 
                        // value={value.name}
                        onChange={e => setTaskName(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="field pb-3">
                <label className="label">Task duration</label>
                <div className="control has-icons-left">
                    <div className="select">
                        <select onChange={e => setTaskDuration(e.target.value)} defaultValue={'Short (30 min)'}> 
        
                        <option>
                            Short (30 min)
                        </option>
                        <option>
                            Medium (1 hr)
                        </option>
                        <option>
                            Long (2 hrs)
                        </option>
                        <option>
                            Custom (Max. 2hrs)
                        </option>
        
                        </select>
                    </div>
                    <div className="icon is-small is-left">
                        <i className="fas fa-filter"></i>
                    </div>
                </div>
            </div>

            <button type='submit' className='button is-success is-fullwidth'>
                <span className="icon">
                    <i className="fas fa-check"></i>
                </span>
                <span className='has-text-weight-bold'>Create Task</span>
            </button>

            <button className='button is-danger is-fullwidth mt-3' onClick={() => onTaskCreated()}>
                <span className="icon">
                    <i className="fas fa-times"></i>
                </span>
                <span className='has-text-weight-bold'>Cancel</span>
            </button>

        </form>
    )
}
