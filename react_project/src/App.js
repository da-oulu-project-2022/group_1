import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { Menu } from './components/Menu'
import { NavigationPage } from './components/NavigationPage'


function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to='/'>Menu</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to='/nav'>NavigationPage</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element= {<Menu />} />
        <Route path="/nav" element={<NavigationPage />} />
      </Routes>
    </>
  );
}


export default App;
