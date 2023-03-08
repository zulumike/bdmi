import React from 'react';
import HomePage from './components/HomePage';
import './styles/variables.css';
import logo from './img/bdmi_logo.png';


function App() {
  return (
    <div className="apptoppdiv">
      <div className="appimgdiv">
        <img src={logo} alt="Logo" className="topimage" />
      </div>
      <HomePage />
    </div>
  )
}

export default App;
