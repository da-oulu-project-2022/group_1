import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Menu from './components/Menu'
import { isConnected } from './components/Menu'


function App() {

  const isConnectionEstablished = isConnected
  
  //isConnectionEstablished == true &&

  return (
    <>
      <Routes>
        <Route path="/" element= { <Menu/> } />
        { 
        <Route path="/HomePage" element= { <HomePage/> } />
        }
        {/* <Route path="/signup" element= { <SignUp/> } /> */}
      </Routes>
    </>
  );
}

export default App;
