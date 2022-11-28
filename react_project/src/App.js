import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import { Connect } from './components/Connect'


function App() {
  const [device, setDevice] = useState();

  const pull_data = (device) => {
    console.log(device);
    setDevice(device);
  }

  return (
    <>
      <Routes>
        <Route path="/" element= { <Connect func={pull_data}/> } />
        <Route path="/HomePage" element= { <HomePage device={device}/> } />
        {/* <Route path="/signup" element= { <SignUp/> } /> */}
      </Routes>
    </>
  );
}

export default App;
