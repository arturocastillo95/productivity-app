import React, { useState } from 'react';
// import './App.css';
import 'bulma/css/bulma.css';
import TodoList from './components/TodoList'
import Form from './components/Form'
// import axios from 'axios'
// import {SortableContainer, SortableElement} from 'react-sortable-hoc';



function App() {
  const [todos, setTodos] = useState([])

  const addToDo = name => {
    const newTodos = [...todos, {id: 1, name: name}]
    setTodos(newTodos)
  } 

  return (
    <div className='has-text-centered'>
      <h1 className='title has-text-centered my-5'>Productivity app</h1>
      <Form addToDo={ addToDo } />
      <TodoList todos={ todos } />
    </div>
  );
}

export default App;
