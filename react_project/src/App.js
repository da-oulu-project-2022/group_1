import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';

import HomePage from './components/HomePage.js';
import { Menu } from './components/Menu'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= { <Menu/> } />
        <Route path="/HomePage" element= { <HomePage/> } />
        {/* <Route path="/signup" element= { <SignUp/> } /> */}
      </Routes>
    </>
  );
}

export default App;
