import React, {useState, useEffect} from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';



const SortableItem = SortableElement(({value}) => {
    return (
        <li className="box">
            <div className="level is-mobile">
                <div className="level-left">
                    <input type="checkbox"/>
                </div>

                <div className="level-item">
                    <h1 className="subtitle">
                        {value.title}
                    </h1>
                </div>

                <div className="level-right">
                    <div className="level-item">
                        <a href="">
                            <span className="icon has-text-success">
                                <i className="fas fa-play"></i>
                            </span>
                        </a>
                    </div>
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
