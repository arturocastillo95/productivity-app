import React, {useState, useEffect, useRef} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {getCookie, taskUpdate,fancyTimeFormat} from './utils'
import {StartTimer} from './Timer'
import {BASE_URL} from './../App'


const SortableItem = SortableElement(({value, onActivateTask, onDeleteTask, onFinishedTask, onEditTask}) => {
    const [active_style, setActiveStyle] = useState(false)

    function timerStarted() {
        onActivateTask(value.id);
        setActiveStyle(true);
    }

    function markAsComplete() {
        setActiveStyle(false);
        onFinishedTask(value);
    }

    return (
        <li className={"box " + (active_style ? 'task-is-active': '')}>
            <div className="level is-mobile">
                <div className="level-left">
                    <input className={" " + (value.completed ? 'is-hidden' : '')} type="checkbox" onChange={() => onFinishedTask(value)}/>
                </div>

                <div className="level-item">
                    <div>
                        <h1 className={"title is-5 " + (value.completed ? 'is-completed': '')}>
                            {value.title}
                        </h1>
                        {active_style === false &&                         
                            <p className="is-help has-text-centered">
                                {fancyTimeFormat(value.remaining)}
                            </p>
                        }
                    </div>
                </div>

                <div className="level-right">

                    <StartTimer value={value} onTimerStart={timerStarted} onTimerPause={() => setActiveStyle(false)} markAsComplete={markAsComplete}/>

                    {active_style === false &&                     
                    <div className={"level-item " + (value.completed ? 'is-hidden': '')} onClick={e => onEditTask(value)}>
                        <a href="#/">
                            <span className="icon has-text-warning">
                                <i className="fas fa-edit"></i>
                            </span>
                        </a>
                    </div>
                    }

                    <div className="level-item">
                        <a href="#/" onClick={e => onDeleteTask(value)}>
                            <span className="icon has-text-danger">
                                <i className="fas fa-lg fa-times"></i>
                            </span>
                        </a>
                    </div>

                </div>

            </div>
        </li>
    )
});

const SortableComponent = SortableContainer(({items, onFocusTask, onDeleteTask, onFinishedTask, onEditTask }) => {

    function setActiveTask(taskId) {
        var index = items.findIndex(i => i.id === taskId);
        onFocusTask(index);
    }

    return (
    <ul>
        {items.map((value, index) => (
            <SortableItem key={value.id} index={index} value={value} onActivateTask={setActiveTask} onDeleteTask={onDeleteTask} onFinishedTask={onFinishedTask} onEditTask={onEditTask}/>
        ))}
    </ul>
    )
})


// Context for setting active tasks
export const ActiveTask = React.createContext(false)

export default function SortableList({ newTaskCreated, completedTasksList, onEditTask, onUpdateTasks, onSort }) {
    const [tasks, setTasks] = useState([]);
    const [active, setActive] = useState(false);
    const active_task = {active, setActive};
    const isInitialMount = useRef(true);
    const [isLoading, setLoading] = useState(true);

    const fetchTasks = async () => {
        const url = BASE_URL + 'api/task-list/' + (completedTasksList ? 'completed/' : 'active/')
        try {
            const response = await fetch(url);
            return response.ok ? response.json() : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    function updateIndex(data) {
        var csrf_token = getCookie('csrftoken');
        
        data.forEach((task, index) => {
            task.order = index;
            taskUpdate(task, csrf_token);
        });
    };

    useEffect(() => {
        switch(onSort) {
            default:
                break;
            case 'longest':
                var sorted = [...tasks];
                sorted.sort((a, b) => (a.remaining < b.remaining) ? 1 : ((b.remaining < a.remaining) ? -1 : 0));
                setTasks(sorted);
                break;
            case 'shortest':
                var sorted = [...tasks];
                sorted.sort((a, b) => (a.remaining > b.remaining) ? 1 : ((b.remaining > a.remaining) ? -1 : 0));
                setTasks(sorted);
                break;
        }
    }, [onSort])

    //Update list when new task is created
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchTasks().then(data => {
                data.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
                var index = data.findIndex(i => i.title === newTaskCreated.title);
                data = arrayMove(data, index, 0);
                data.forEach((value, i) => {
                    value.order = i;
                })
                setTasks(data);
                updateIndex(data);
            })
        }

    }, [newTaskCreated])

    useEffect(() => {
        
        fetchTasks()
        .then(data => {
            data.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
            setTasks(data);
            setLoading(false);
            }
        );
    }, [onUpdateTasks]);

    const onSortEnd =  ({oldIndex, newIndex}) => {
        var newOrder = [...tasks];
        newOrder = arrayMove(newOrder, oldIndex, newIndex);
                        
        updateIndex(newOrder);
        setTasks(newOrder);

    };

    function deleteTask(e) {
        var newTasks = tasks.filter(i => i.id !== e.id);
        setTasks(newTasks);

        var csrf_token = getCookie('csrftoken');
        var url = BASE_URL + 'api/task-delete/' + e.id + '/';

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            }
        });
    }

    function getCurrentDate() {
        var date = new Date();
        var dd = String(date.getDate()).padStart(2,'0');
        var mm = String(date.getMonth() + 1).padStart(2,'0');
        var year = date.getFullYear();

        var today = year + '-' + mm + '-' + dd;
        return today;
    }

    function markTaskAsComplete(e) {
        var index = tasks.findIndex(i => i.id === e.id)
        var updates = [...tasks];
        updates[index].completed = true;
        updates[index].finish_date = getCurrentDate();
        var csrf_token = getCookie('csrftoken')

        setTasks(updates);
        taskUpdate(updates[index], csrf_token);
    }

    function focusTask(taskIndex) {
        var newOrder = arrayMove(tasks, taskIndex, 0);
        setTasks(newOrder)
    };

    return (
        <>
        
        {isLoading === true && 
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        }

        {isLoading === false && 
        <ActiveTask.Provider value={active_task}>
            <SortableComponent distance={2} items={tasks} onSortEnd={onSortEnd} onFocusTask={focusTask} onDeleteTask={deleteTask} onFinishedTask={markTaskAsComplete} onEditTask={onEditTask}/>
        </ActiveTask.Provider>
        }
        </>
    )
}
