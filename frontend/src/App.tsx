import React from 'react';
import logo from './logo.svg';
import './App.css';
import Mainpage from './pages/main'
import {BrowserRouter, Route} from "react-router-dom";


function App() {
  return (

    <div className="App">
      <Mainpage/>
    </div>

  );
}

export default App;
