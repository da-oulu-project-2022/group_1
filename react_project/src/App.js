import './App.css';
import './bluetooth';
import Header from './components/header';
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
                switch (service.uuid) {
                    case "fb005c80-02e7-f387-1cad-8acd2d8df0c8":
                        service.getCharacteristic("fb005c82-02e7-f387-1cad-8acd2d8df0c8").then(dataCharacteristic => {
                            dataCharacteristic.startNotifications().then( value =>{
                                console.log(value);
                            });
                            return dataCharacteristic;
                        }).then(dataCharacteristic => {
                            console.log(dataCharacteristic);
                            console.log("notification started");
                            dataCharacteristic.addEventListener('characteristicvaluechanged', test);
                            console.log("added EventListener");



                        }).then (_ => {
                            service.getCharacteristic("fb005c81-02e7-f387-1cad-8acd2d8df0c8").then(controlCharacteristic => {
                                console.log(controlCharacteristic);
                                console.log("writing value to device");
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
    <div className="App">
      <Header/>
      <h1>Get Device Battery Info Over Bluetooth</h1>
      {supportsBluetooth && !isDisconnected &&
        <p>Battery level: {batteryLevel}</p>
      }
      {supportsBluetooth && isDisconnected &&
        <button onClick={onClickEvent}>Connect to a Bluetooth device</button>
      }
      {!supportsBluetooth &&
        <p>This browser doesn't support the Web Bluetooth API</p>
      }
      <div>
        acceleration: {acceleration}
      </div>
      <div>
        ecg: {ecg}
      </div>
    </div>
  );
}


export default App;
