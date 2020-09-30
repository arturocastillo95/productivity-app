import React, {useState, useEffect, useContext} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

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


function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const Timer = ({ seconds, onTimeUpdate }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);
  
    useEffect(() => {
      // exit early when we reach 0
        if (!timeLeft) return;

      // save intervalId to clear the interval when the
      // component re-renders
        const intervalId = setInterval(() => {
        if (timeLeft > 0) {
            setTimeLeft(timeLeft - 1);
            onTimeUpdate(timeLeft)
        }
        }, 1000);
  
      // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
      // add timeLeft as a dependency to re-rerun the effect
      // when we update it
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(seconds)
    }, [seconds])

    return (
    <div>
        <h1 className='has-text-success'>{fancyTimeFormat(timeLeft)}</h1>
    </div>
    );
    };



const StartTimer = ({ value, onTimerStart }) => {

    const [timer, setTimer] = useState({'state': 'paused', 'seconds': '0'});
    const {active, setActive} = useContext(ActiveTask);

    function startTimer() {
        setTimer({'state': 'running', 'seconds': value.remaining});
        setActive(true);
        onTimerStart();
    }

    function pauseTimer() {
        setTimer({'state': 'paused', 'seconds': '0'})
        setActive(false)
    }

    function timeUpdate(s) {
        var url = 'http://127.0.0.1:8000/api/task-update/' + value.id + '/';
        var csrf_token = getCookie('csrftoken');

        var new_remaining = value
        new_remaining.remaining = s

        fetch(url, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            'body': JSON.stringify(value)
            });

        }
    
    
    return (
        <div className="level-item">

            {timer.state === 'paused' && active === false &&
            <a href="/#" onClick={startTimer}>
                <span className="icon has-text-success">
                    <i className="fas fa-play"></i>
                </span>
            </a>
            }
            
            {timer.state === 'running' &&
            <a href="/#" onClick={pauseTimer}>
                <span className="icon has-text-success">
                    <i className="fas fa-pause"></i>
                </span>
            </a>
            }

            {timer.state === 'running' && 
            <Timer seconds={timer.seconds} onTimeUpdate={timeUpdate}/>
            }

        </div>
    )
}



const SortableItem = SortableElement(({value, onActivateTask}) => {

    function timerStarted() {
        onActivateTask(value.id)
    }

    return (
        <li className="box">
            <div className="level is-mobile">
                <div className="level-left">
                    <input type="checkbox"/>
                </div>

                <div className="level-item">
                    <h1 className="title is-5">
                        {value.title}
                    </h1>
                </div>

                <div className="level-right">

                    <StartTimer value={value} onTimerStart={timerStarted} />

                    <div className="level-item">
                        <a href="">
                            <span className="icon has-text-warning">
                                <i className="fas fa-edit"></i>
                            </span>
                        </a>
                    </div>
                </div>

            </div>
        </li>
    )
});

const SortableComponent = SortableContainer(({items, onFocusTask}) => {

    function setActiveTask(taskId) {
        var index = items.findIndex(i => i.id === taskId);
        onFocusTask(index)
    }

    return (
    <ul>
        {items.map((value, index) => (
          <SortableItem key={value.id} index={index} value={value} onActivateTask={setActiveTask}/>
        ))}
      </ul>
    )
})


// Context
export const ActiveTask = React.createContext(false)

export default function SortableList() {
    const [tasks, setTasks] = useState([]);
    const [active, setActive] = useState(false);
    const active_task = {active, setActive};

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/task-list/')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
            setTasks(data)
            }
        )
        // return () => {
        //     cleanup
        // };
    }, []);

    const onSortEnd =  ({oldIndex, newIndex}) => {
        var newOrder = [...tasks];
        newOrder = arrayMove(newOrder, oldIndex, newIndex);
                        
        newOrder.forEach((task, index) => {
            var url = 'http://127.0.0.1:8000/api/task-update/' + task.id + '/'
            var csrf_token = getCookie('csrftoken');
            task.order = index;

            fetch(url, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf_token,
                },
                'body': JSON.stringify(task)
            })


        })

        setTasks(newOrder)

    }

    function focusTask(taskIndex) {
        var focusTask = tasks[taskIndex];
        var newOrder = tasks;
        newOrder.splice(taskIndex, 1);
        newOrder.unshift(focusTask);

        setTasks(newOrder)

    }

    return (
        <>
        <ActiveTask.Provider value={active_task}>
            <SortableComponent items={tasks} onSortEnd={onSortEnd} onFocusTask={focusTask}/>
        </ActiveTask.Provider>
        </>
    )
}
