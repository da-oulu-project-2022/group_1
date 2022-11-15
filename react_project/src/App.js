import './components/modules/App.module.css';
import './components/bluetooth.js';
import Clock from './components/clock.js';
import BarChart, { IotChart } from './components/chart.js';
import React, { useState, useEffect } from 'react';   

function App() {
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [acceleration, setAcceleration] = useState(null);
  const [ecg, setEcg] = useState(null);

  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);

  /**
   * Let the user know when their device has been disconnected.
   */
  const onDisconnected = (event) => {
    alert(`The device ${event.target} is disconnected`);
    setIsDisconnected(true);
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

const onClickEvent = () => {
  navigator.bluetooth.requestDevice(options)
    .then(device => device.gatt.connect())
    .then(server => {
        return server.getPrimaryServices();
    })
    .then(services => {
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
  }
}

  const connectToDeviceAndSubscribeToUpdates = async () => {
    try {
      // Search for Bluetooth devices that advertise a battery service
      const device = await navigator.bluetooth
        .requestDevice(options);

      setIsDisconnected(false);

      // Add an event listener to detect when a device disconnects
      device.addEventListener('gattserverdisconnected', onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device.gatt.connect();

      // Get the battery service from the Bluetooth device
      const batService = await server.getPrimaryService('battery_service');

      const accService = await server.getPrimaryService('fb005c80-02e7-f387-1cad-8acd2d8df0c8');

      // Get the battery level characteristic from the Bluetooth device
      const characteristic = await batService.getCharacteristic('battery_level');

      const pmdControlCharacteristic = await accService.getCharacteristic('fb005c81-02e7-f387-1cad-8acd2d8df0c8');

      const pmdDataCharacteristic = await accService.getCharacteristic('fb005c82-02e7-f387-1cad-8acd2d8df0c8');

      pmdControlCharacteristic.writeValueWithResponse(new Uint8Array([0x02, 0x03]));

      pmdDataCharacteristic.startNotifications();

      pmdDataCharacteristic.addEventListener('characteristicValueChanged',
        handleCharacteristicValueChanged);

      // Subscribe to battery level notifications
      characteristic.startNotifications();

      // When the battery level changes, call a function
/*       characteristic.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged); */

      // Read the battery level value
      const reading = await characteristic.readValue();
      const readingAcc = await pmdControlCharacteristic.readValue();
      setAcceleration(readingAcc.getUint8(1));

      // Show the initial reading on the web page
      setBatteryLevel(reading.getUint8(0) + '%');
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  };


  
  

  return (
<div class="back">

<div class="header">
    <img class="logo" src="/polarLogo.png"/>
    <button onClick={onClickEvent} id="connectButton">Connect device</button>
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
