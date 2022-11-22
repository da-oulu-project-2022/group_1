import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';

import { Menu } from './components/Menu'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<Menu />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
