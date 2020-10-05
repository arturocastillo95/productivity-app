import React, {useState} from 'react'
import {getCookie, createSampleTasks, taskUpdate, createTask} from './utils'
import {DurationSelector} from './DurationSelector'

export default function Form({ editValue, onTaskCreated, onCancelCreate, onUpdateTasks }) {
    const [value, setValue] = useState((Object.keys(editValue).length === 0 ? {'title': '', 'duration': 1800, 'remaining': 1800} : editValue));

    const handleCreate = e => {
        e.preventDefault();
        if (!value.title) return;
        
        var csrf_token = getCookie('csrftoken');

        if (!value.id) {
            createTask(value, csrf_token);
            onTaskCreated(value);
            return;
        }

        taskUpdate(value, csrf_token);
        onUpdateTasks();
    };

    const handleCreateSamples = () => {
        createSampleTasks().then(e => onUpdateTasks());
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
                break;
        }
    }

    return (
        <>
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
                        onChange={e => setTaskName(e.target.value)}
                        defaultValue={value.title}
                        autoFocus
                    />
                </div>
            </div>

            <DurationSelector setTaskDuration={setTaskDuration}/>

            <button type='submit' className='button is-success is-fullwidth'>
                <span className="icon">
                    <i className="fas fa-check"></i>
                </span>
                <span className='has-text-weight-bold'>
                    {value.id != null &&
                    <span>Save changes</span>
                    }
                    {value.title === '' &&
                    <span>Create Task</span>
                    }
                </span>
            </button>

        </form>

            <button className='button is-danger is-fullwidth mt-3' onClick={onCancelCreate}>
                <span className="icon">
                    <i className="fas fa-times"></i>
                </span>
                <span className='has-text-weight-bold'>Cancel</span>
            </button>

            {value.title === '' &&             
            <button className='button is-info is-fullwidth mt-3' onClick={handleCreateSamples}>
                <span className="icon">
                    <i className="fas fa-vial"></i>
                </span>
                <span className='has-text-weight-bold'>Generate Sample Tasks</span>
            </button>
            }

        </>
    )
}
