import React from 'react';
import './components/modules/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Home from './components/Home.js';
// import Login from './components/Login';
// import SignUp from './components/SignUpView.js';


class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      supportsBluetooth: false,
      isDisconnected: true,
      batterylevel: null,
      acceleration: null,
      ecg: null

    }
  }

  render() {

    return (
      <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element= { <Home /> } />
          {/* <Route path="/signup" element={ <SignUp /> } />
          <Route path="/login/*" element={ <Login /> }/> */}
        </Routes>
      </div>
      </BrowserRouter>
    );

  }
}

export default App;
