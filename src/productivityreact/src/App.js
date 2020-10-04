import React, {useState} from 'react';
import './App.css';
import SortableList from './components/SortableList';
import {Modal} from 'react-bulma-components';
import Form from './components/Form'
import Chart from './components/Chart'

function App() {

  const [createTask, setCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({});
  const [appView, setView] = useState('toDo');

  function newTaskCreated(t) {
    setNewTask(t);
    setCreateForm(false);
  }

  function cancelCreate() {
    setCreateForm(false);
  }

  return (
    
    <div className="main py-3">
      
      <h1 className='title has-text-centered py-3'>
        Productivity <span className='has-text-weight-light'>App</span>
      </h1>

      <div className="tabs is-centered is-boxed">
        <ul>
          <li className={"" + (appView === 'toDo' ? 'is-active' : '')} onClick={() => setView('toDo')}>
            <a href="#/">
              <span className="icon is-small"><i className="fas fa-stream" aria-hidden="true"></i></span>
              <span>To Do</span>
            </a>
          </li>
          <li className={"" + (appView === 'completedList' ? 'is-active' : '')} onClick={() => setView('completedList')}>
            <a href="/#">
              <span className="icon is-small"><i className="fas fa-check" aria-hidden="true"></i></span>
              <span>Completed</span>
            </a>
          </li>
          <li className={'' + (appView === 'stats' ? 'is-active': '')} onClick={() => setView('stats')}>
            <a href="/#">
              <span className="icon is-small"><i className="fas fa-chart-line" aria-hidden="true"></i></span>
              <span>Stats</span>
            </a>
          </li>
        </ul>
      </div>


      {/* Show coompleted list */}
      {appView === 'completedList' &&
        <section className='container is-fluid has-text-centered'> 

          <SortableList newTaskCreated={newTask} completedTasksList={true}/>
          
          <Modal className='modal-fx-fadeInScale' show={createTask} onClose={() => setCreateForm(false)}>
            <div className="box modal-box">
              <Form onTaskCreated={newTaskCreated} onCancelCreate={cancelCreate}/>
            </div>
          </Modal>

        </section>
      }

      {appView === 'toDo' &&
        <section className='container is-fluid has-text-centered'> 

          <div className="columns is-variable is-1 is-mobile">

            <div className="column is-9">
              <a href='/#' className='button mb-5 is-fullwidth is-rounded' onClick={() => setCreateForm(true)}>
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Create new task</span>
              </a>
            </div>

            <div className="column">

              <div className="control has-icons-left">
                <div className="select is-fullwidth is-rounded">
                  <select defaultValue='No sort'>
    
                    <option>
                      No sort
                    </option>
                    <option>
                      Longest tasks
                    </option>
                    <option>
                      Shortest tasks
                    </option>
    
                  </select>
                </div>
                <div className="icon is-small is-left">
                  <i className="fas fa-filter"></i>
                </div>
              </div>
              </div>

          </div>

          <SortableList newTaskCreated={newTask} completedTasksList={false}/>
          
          <Modal show={createTask} onClose={() => setCreateForm(false)}>
            <div className="box modal-box">
              <Form onTaskCreated={newTaskCreated} onCancelCreate={cancelCreate}/>
            </div>
          </Modal>

        </section>
      }

      {appView === 'stats' && 
        <Chart />
      }

    </div>
  );
}

export default App;
