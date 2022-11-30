import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import { Connect } from './components/Connect'


function App() {
  const [device, setDevice] = useState();
  const [connection, setConnection] = useState();

  const pullData = (device) => {
    console.log(device);
    setDevice(device);
  }

  const isConnected = (connection) => {
    console.log(connection)
    if (connection) {
      setConnection(connection);
    }
    
  }

  return (
    <>
      <Routes>
        <Route path="/" element= { <Connect func={ pullData } checkConnection={ isConnected }/> } />
        {
       //   connection && //RETURN THIS 
          <Route path="/HomePage" element= { <HomePage device={device}/> } />
        }
      </Routes>
    </>
  );
}

export default App;
