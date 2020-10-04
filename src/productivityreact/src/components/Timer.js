import React, {useState, useEffect, useContext} from 'react'
import {fancyTimeFormat, getCookie, taskUpdate} from './utils'
import {ActiveTask} from './SortableList'

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

export const StartTimer = ({ value, onTimerStart, onTimerPause }) => {

    const [timer, setTimer] = useState({'state': 'paused', 'seconds': '0'});
    const {active, setActive} = useContext(ActiveTask);

    function startTimer() {
        setTimer({'state': 'running', 'seconds': value.remaining});
        onTimerStart();
        setActive(true);
    }

    function pauseTimer() {
        setTimer({'state': 'paused', 'seconds': '0'});
        setActive(false);
        onTimerPause();
    }

    function timeUpdate(s) {
        var csrf_token = getCookie('csrftoken');

        var new_remaining = value;
        new_remaining.remaining = s;

        taskUpdate(new_remaining, csrf_token)
        }
    
    
    return (
        <div className={"level-item " + (value.completed ? 'is-hidden' : '')}>

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