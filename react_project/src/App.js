import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage.js';


function App() {

  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element= { <HomePage/> } />
        {/* <Route path="/signup" element= { <SignUp/> } /> */}
      </Routes>
    </div>
    </BrowserRouter>
  );
}


export default App;
