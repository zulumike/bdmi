import React from 'react';
import HomePage from './components/HomePage';
import './styles/variables.css';

function App() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="apptopdiv">
        <HomePage />
      </div>
    )
  }
  else {
    return (
      <div className="apptopdiv">
        <h2 style={{color: "red", textAlign: "center"}}>STAGING</h2>
        <HomePage />
      </div>
    )
  }
}

export default App;
