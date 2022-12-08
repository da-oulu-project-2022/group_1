import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import H10 from './components/H10';
import VeritySense from './components/VeritySense';
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

  const isDisconnected = (connection) => {
    console.log(connection)
    if (connection) {
      setConnection(connection);
    }
  }

  return (
    <>
      <Routes>
        <Route path="/*" element= { <Connect func={ pullData } checkConnection={ isDisconnected }/> } />
        {
      //     connection &&
      //     <Route path="/HomePage" element= { <HomePage device={device} checkConnection={ isConnected }/> } />


      //   connection && //RETURN THIS 
          <>
            <Route path="/VeritySense" element={<VeritySense device={device} />} />
            <Route path="/H10" element={<H10 device={device} />} />
          </>
        }
      </Routes>
    </>
  );
}

export default App;
