import React, {useState, useEffect} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';


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

const Timer = ({ seconds }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);
  
    useEffect(() => {
      // exit early when we reach 0
        if (!timeLeft) return;

      // save intervalId to clear the interval when the
      // component re-renders
        const intervalId = setInterval(() => {
        if (timeLeft > 0) {setTimeLeft(timeLeft - 1);}
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

const StartTimer = ({ value }) => {

    const [seconds, setTimer] = useState('0')

    // const startTimer = e => {
    //     console.log(value.duration)
    //     setTimer( value.duration )
    // }
    
    return (
        <div className="level-item">
            <a onClick={() => setTimer(value.duration)}>
                <span className="icon has-text-success">
                    <i className="fas fa-play"></i>
                </span>
            </a>
            <Timer seconds={seconds} />
        </div>
    )
}



const SortableItem = SortableElement(({value}) => {
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

                    <StartTimer value={value}/>

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

const SortableComponent = SortableContainer(({items}) => {
    return (
    <ul>
        {items.map((value, index) => (
          <SortableItem key={value.id} index={index} value={value} />
        ))}
      </ul>
    )
})

export default function SortableList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/task-list/')
        .then(response => response.json())
        .then(data => 
          setTasks(data)
          )
        // return () => {
        //     cleanup
        // };
    }, []);

    const onSortEnd =  ({oldIndex, newIndex}) => {
        var newOrder = [...tasks]
        newOrder = arrayMove(newOrder, oldIndex, newIndex)
        setTasks(newOrder)
    }

    return (
        <SortableComponent items={tasks} onSortEnd={onSortEnd}/>
    )
}
