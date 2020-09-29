import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './components/Form'
import SortableList from './components/SortableList'


function App() {

  return (
    
    <div className="main py-3">

      <h1 className='title has-text-centered py-3'>Productivity app</h1>

      <div className="tabs is-centered is-boxed">
        <ul>
          <li className="is-active">
            <a>
              <span className="icon is-small"><i className="fas fa-stream" aria-hidden="true"></i></span>
              <span>To Do</span>
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small"><i className="fas fa-check" aria-hidden="true"></i></span>
              <span>Completed</span>
            </a>
          </li>
          <li>
            <a>
              <span className="icon is-small"><i className="fas fa-chart-line" aria-hidden="true"></i></span>
              <span>Stats</span>
            </a>
          </li>
        </ul>
      </div>

      <section className='container is-fluid has-text-centered'>  

        <SortableList/>


      </section>
    </div>
  );
}

export default App;
