import styles from './modules/Connect.module.css'
import Clock from './Clock'
import clock from './modules/Clock.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export function isConnected() { // This is to be used in preventing "unauthorized" access
  return true
}

export function Connect(props) {

  const navigate = useNavigate();
  const [device, setDevice] = useState();
  const [isConnected, setConnection] = useState(); // This is to be used in preventing "unauthorized" access
  const supportedDevices = [
    "Polar H10 AFCBA929",
    "Polar Sense B5E5C726",
    "Polar OH1 50924E2C"
  ]
  // This is to be used to filter the sensor connection. Wrong sensor = no access. H10 sensor = navigate to H10 component
  const connectionEstablished = (connectedDeviceName) => {
    console.log(`Connected device name: ${connectedDeviceName}`);
    if (connectedDeviceName === supportedDevices[0]) {
      navigate('/H10');
    } else if (connectedDeviceName === supportedDevices[1] || connectedDeviceName === supportedDevices[2]){
      navigate('/VeritySense');
    } else {
      alert("Device is not supported");
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
        console.log(server);
        props.checkConnection(true)
        connectionEstablished(server.device.name);
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
          <header>
          <img  src={require('../components/images/Simplefitlogo.png')} alt=''/>
          </header>
          <div className={styles.content}>
            <div className={ styles.container }>
                <p className={ styles.welcome }>Welcome to SimpleFit</p>
                <Clock styles ={clock.clock1} />
                <button onClick={ onClickEvent } className={ styles.button }>Connect Device</button>
            </div>
          </div>

          <footer >
            
          </footer>
        </body>
      </div>
    ) 
}

export default Connect;