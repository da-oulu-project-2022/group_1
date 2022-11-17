import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import HomePage from './components/homePage.js';
import { Menu } from './components/Menu'


function App() {

  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element= { <Menu/> } />
        {/* <Route path="/signup" element= { <SignUp/> } /> */}
      </Routes>
    </div>
    </BrowserRouter>
  );
}


export default App;
