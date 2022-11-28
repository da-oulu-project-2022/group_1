import styles from './modules/Menu.module.css'
import MenuClock from './MenuClock'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

export function isConnected() { // This is to be used in preventing "unauthorized" access
  return true
}

export function Menu() {

  const navigate = useNavigate();
  const [isConnected, setConnection] = useState(); // This is to be used in preventing "unauthorized" access
  const supportedDevices = [
    "Polar H10 AFCBA929",
    "The other device"
  ]
  const connectionEstablished = (connectedDeviceName) => {
    console.log(`Connected device name: ${connectedDeviceName}`);
    for (let device of supportedDevices) {
      if (connectedDeviceName == device) {
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
        return server.getPrimaryServices();
      })
      /* .then(services => {
          console.log(services);
          let queue = Promise.resolve();
          services.forEach(service => {
            //console.log(service)
              switch (service.uuid) {
                case "0000180f-0000-1000-8000-00805f9b34fb":
                  //batterylevel
                  service.getCharacteristic("00002a19-0000-1000-8000-00805f9b34fb").then( value =>{
                    value.addEventListener('characteristicvaluechanged', batteryLevelChanged);
                    console.log(value);
                  });
                    
                  break;
                case "0000180d-0000-1000-8000-00805f9b34fb":
                  //heartrate
                  service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb").then( value =>{
                    value.addEventListener('characteristicvaluechanged', heartRateChanged);
                    console.log(value);
                });
                  break;
                case "0000180a-0000-1000-8000-00805f9b34fb":
                  break;
                case "fb005c80-02e7-f387-1cad-8acd2d8df0c8":
                    service.getCharacteristic("fb005c82-02e7-f387-1cad-8acd2d8df0c8").then(dataCharacteristic => {
                        dataCharacteristic.startNotifications().then( value =>{
                            //console.log(value);
                        });
                        return dataCharacteristic;
                    }).then(dataCharacteristic => {
                        //console.log(dataCharacteristic);
                        //console.log("notification started");
                        dataCharacteristic.addEventListener('characteristicvaluechanged', test);
                        //console.log("added EventListener");
  
  
  
                      }).then (_ => {
                          service.getCharacteristic("fb005c81-02e7-f387-1cad-8acd2d8df0c8").then(controlCharacteristic => {
                              //console.log(controlCharacteristic);
                              //console.log("writing value to device");
                              controlCharacteristic.writeValueWithoutResponse(new Uint8Array([0x00, 0x03]))
  
  
                          })
                      })
  
  
                  break;
  
                default:
  
                  break;
                }
            })
        }) */
        .catch(error => {
            console.log('Argh! ' + error);
        }); 

        /* function test(event) {
          let commandValue = event.target.value.getUint8(0);
          console.log(event);
      }
      function heartRateChanged(event){
        console.log(event);
      }
      function batteryLevelChanged(event){
        console.log(event);
      } */
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