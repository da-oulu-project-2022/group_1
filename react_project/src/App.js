import './App.css';
import './bluetooth';
import Clock from './components/clock';
import BarChart, { IotChart } from './components/chart';

import React, { useState, useEffect } from 'react';   

function App() {
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [acceleration, setAcceleration] = useState(null);
  const [ecg, setEcg] = useState(null);
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [services, setServices] = useState(null);

  const PMD_Service = "fb005c80-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Service = "0000180d-0000-1000-8000-00805f9b34fb";
  const Battery_Service = "0000180f-0000-1000-8000-00805f9b34fb";

  const Cntrl_char = "fb005c81-02e7-f387-1cad-8acd2d8df0c8";
  const Data_char = "fb005c82-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Char = "00002a37-0000-1000-8000-00805f9b34fb";
  const Battery_Char = "00002a19-0000-1000-8000-00805f9b34fb";
  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    console.log("updated");
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);

  /**
   * Let the user know when their device has been disconnected.
   */
  const onDisconnectedButtonClick = () => {
    if (device.gatt.connected) {
      device.gatt.disconnect();
      alert("Bluetooth device disconnected");
    }
  }

  /**
   * Update the value shown on the web page when a notification is
   * received.
   */
  const handleCharacteristicValueChanged = (event) => {
    setBatteryLevel(event.target.value.getUint8(0) + '%');
  }

  const handleAccValueChanged = (event) => {
    setAcceleration(event.target.value.getUint8(0));
  }

  const handleEcgValueChanged = (event) => {
    setEcg(event.target.value.getUint8(0));
  }

  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */

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
  
const connectDevice = () => {
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    setDevice(device);
    device.gatt.connect()
    .then(server => {
      setServer(server);
      server.getPrimaryServices()
      .then(services => {
        setServices(services);
        /* .then(char => {
          console.log(char);
          console.log(char.properties);
          char.addEventListener("characteristicvaluechanged", heartRateChanged);
          char.startNotifications();
        })
        service.getCharacteristic(Cntrl_char)
        .then(char => {
          char.writeValueWithResponse(new Uint8Array([1, 0]))
          .then(value => {
            console.log(value);
          })
          char.writeValueWithResponse(new Uint8Array([2, 2, 0, 1, 0x34, 0, 1, 1, 0x10, 0, 2, 1, 8, 0, 4, 1, 3]));
        }) */
      })
    });
  });
/*   navigator.bluetooth.requestDevice(options)
    .then(device => {
      setDevice(device);
      return device.gatt.connect();
    })
    .then(server => {
      return server.getPrimaryServices();
    })
    .then(services => {
        console.log(services);
        // let queue = Promise.resolve();
        services.forEach(service => {
          //console.log(service)
            switch (service.uuid) {
              case "0000180f-0000-1000-8000-00805f9b34fb":
                //batterylevel
                service.getCharacteristic("00002a19-0000-1000-8000-00805f9b34fb")
                .then(value => {
                  value.addEventListener('characteristicvaluechanged', batteryLevelChanged);
                    console.log(value);
                });
                  
                break;
              case "0000180d-0000-1000-8000-00805f9b34fb":
                //heartrate
                service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb")
                .then(value => {
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
                          console.log(controlCharacteristic.properties);
                          //console.log("writing value to device");
                          controlCharacteristic.startNotifications();
                          controlCharacteristic.writeValueWithResponse(new Uint8Array([0x02, 0x03]))
                          .then(_ => {
                            console.log(controlCharacteristic.readValue());
                          })


                        })
                    })


                break;

              default:

                break;
              }
          })
      })
      .catch(error => {
          console.log('Argh! ' + error);
      });

  function test(event) {
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

function stopStream(){
  server.getPrimaryService(PMD_Service)
  .then(service => {
    service.getCharacteristic(Cntrl_char)
    .then(char => {
      char.writeValueWithResponse(new Uint8Array([3, 3]))
      .then(_ => {
        alert("Data stream stopped");
      })
    })
  })
}

function testi(event){
  console.log(event);
}

function heartRateChanged(event){
  console.log(event.target.value);
}

function batteryLevelChanged(event){
  console.log(event.target.value);
}

const startStream = () => {
  console.log(device);
  console.log(server);
  console.log(services);
  console.log("täällä");
  services.forEach(element => {
    if (element.uuid === PMD_Service) {
      element.getCharacteristic(Cntrl_char)
      .then(controlChar => {
        console.log(controlChar.properties);
        controlChar.writeValueWithResponse(new Uint8Array([0x02, 0x03]));
        /* controlChar.writeValueWithResponse(new Uint8Array([2, 2, 0, 1, 0x34, 0, 1, 1, 0x10, 0, 2, 1, 8, 0, 4, 1, 3])); */
      })
      .then(_ => {
        element.getCharacteristic(Data_char)
        .then(dataChar => {
          dataChar.startNotifications();
          dataChar.addEventListener("characteristicvaluechanged", testi);
        })
      });
    } if (element.uuid === Heart_rate_Service) {
        element.getCharacteristic(Heart_rate_Char)
        .then(heartRateChar => {
          console.log(heartRateChar);
          heartRateChar.startNotifications();
          heartRateChar.addEventListener("characteristicvaluechanged", heartRateChanged);
        })
    } if (element.uuid === Battery_Service) {
        element.getCharacteristic(Battery_Char)
        .then(char => {
          console.log(char.properties);
          char.readValue()
          .then(value => {
            console.log(value);
          })
          char.addEventListener("characteristicvaluechanged", batteryLevelChanged);
        })
    }
  });
}


  return (
<div class="back">

<div class="header">
    <img class="logo" src="/polarLogo.png"/>
    <button onClick={connectDevice} id="connectButton">Connect device</button>
    <button onClick={onDisconnectedButtonClick} class="disConnectButton">Disconnect device</button>
    <button onClick={startStream} class="disConnectButton">Start stream</button>
    <button onClick={stopStream} class="disConnectButton">Stop stream</button>
</div>
<hr/>
<div class="stats-container">
    <div class="small-column">
        <div class="data dataText">0</div>
        <div class="data dataUnit">khm/h</div>
    </div>
    <div class="small-column">
    <Clock/>
        
    </div>
    <div class="small-column">
        <div class="data dataText">0</div>
        <div class="data dataUnit">BPM</div>
    </div>
</div>
<hr/>
<div class="stats-container">
    <div class="small-column">
        <div class="data dataText">60</div>
        <div class="data dataUnit">Lowest BPM</div>
    </div>
    <div class="small-column">
        <div>
       <img id="heartSprite" src = "./heart.png" hidden="true"/>
       <div id="dataText" class="dataText">0</div>
       <div class="dataUnit">BPM</div>
        </div>
    </div>
    <div class="small-column">
        <div class="data dataText">120</div>
        <div class="data dataUnit">Highest BPM</div>
    </div>
</div>
<hr/>
<div class="graph-container">
    <div class="big-column">
        <IotChart/>
        <div class="graph-name2">ECG</div>
    </div>
    <div class="big-column">
        <IotChart/>
        <div class="graph-name">PPG</div>
    </div>
</div>
</div>
  );
}


export default App;
