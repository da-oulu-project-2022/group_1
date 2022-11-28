import styles from './modules/Menu.module.css'
import MenuClock from './MenuClock'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export function isConnected() { // This is to be used in preventing "unauthorized" access
  return true
}

export function Menu(props) {

  const navigate = useNavigate();
  const [device, setDevice] = useState();
  const [isConnected, setConnection] = useState(); // This is to be used in preventing "unauthorized" access
  const supportedDevices = [
    "Polar H10 AFCBA929",
    "Polar Sense B5E5C726"
  ]
  const connectionEstablished = (connectedDeviceName) => {
    console.log(`Connected device name: ${connectedDeviceName}`);
    for (let device of supportedDevices) {
      if (connectedDeviceName === device) {
        navigate('/HomePage')
      }
    }
  }


  let options = {
      filters: [
        {
          manufacturerData: [{ companyIdentifier: 0x006b }] // Filtering devices with company indentifier, showing only devices made by Polar
        },
        {
          services: ["heart_rate"]
        }
      ],
      acceptAllDevices: false,
      optionalServices: [
        "0000180a-0000-1000-8000-00805f9b34fb",
        "0000180f-0000-1000-8000-00805f9b34fb",
        "fb005c80-02e7-f387-1cad-8acd2d8df0c8"
      ]
    }
    
  const onClickEvent = () => {
    navigator.bluetooth.requestDevice(options)
      .then(device => device.gatt.connect())
      .then(server => {
        setConnection(true)
        console.log(server);
        connectionEstablished(server.device.name);
        setDevice(server.device);
        props.func(server.device);
        //return server.getPrimaryServices();
      })
      .catch(error => {
            console.log('Argh! ' + error);
      }); 
  }

    return(
      <div>
        <head></head>
        <body>
          <header></header>
          <div className={styles.content}>
            <div className={ styles.container }>
                <div className={ styles.welcome }>Welcome</div>
                  <MenuClock />
                <button onClick={ onClickEvent } className={ styles.button }></button>
            </div>
          </div>

          <footer >
            <img style={{height: 70, width: 300}} src={require('../components/images/Simplefitlogo.png')} alt=''/>
          </footer>
        </body>
      </div>
    ) 
}

export default Menu;