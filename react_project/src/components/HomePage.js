import './modules/Connect.module.css';
import Clock from './Clock.js';

import BarChart, { IotChart } from './Chart';
import styles from './modules/HomePage.module.css';
import clock from './modules/Clock.module.css';


import React, { useState, useEffect } from 'react';   

function App(props) {
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

  const ECG_Array = new Uint8Array([0x02, 0x00, 0x00, 0x01, 0x82, 0x00, 0x01, 0x01, 0x0E, 0x00]);
  const PPG_Array = new Uint8Array([0x02, 0x01, 0x00, 0x01, 0x87, 0x00, 0x01, 0x01, 0x16, 0x00, 0x04, 0x01, 0x04]);
  const ACC_Array = new Uint8Array([0x02, 0x02, 0x00, 0x01, 0x34, 0x00, 0x01, 0x01, 0x10, 0x00, 0x02, 0x01, 0x08, 0x00, 0x04, 0x01, 0x03]);
  const PPI_Array = new Uint8Array([0x02, 0x03]);

  const bpm_normal = document.getElementById("bpm_normal");
  const bpm_high = document.getElementById("bpm_high");
  const bpm_low = document.getElementById("bpm_low");
  const alert_box = document.getElementById("alertbox");

  let lowest_bpm;
  let highest_bpm;
  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    console.log("updated");
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);

  function pasrseToInt24(byte_array){
    let m_array = new Uint8Array(byte_array)
    let value0 = m_array[0].toString(16)
    if (value0.length == 1){ value0 = 0 + value0}
    let value1 = m_array[1].toString(16)
    if (value1.length == 1){ value1 = 0 + value1}
    let value2 = m_array[2].toString(16)
    if (value2.length == 1){ value2 = 0 + value2}
    let value = value2 + value1 + value0;
    value = parseInt(value, 16);
    
    if (value > 8388607) { value = value - 16777216 };
    return value;
  }

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
  const handleBatteryValueChanged = (event) => {
    //setBatteryLevel(event.target.value.getUint8(0) + '%');
    console.log("Batterylevel: " + event.target.value.getUint8(0) + '%');
  }

  const handleEcgValueChanged = (event) => {
    console.log("\n\nNew values");
    console.log(event.target.value);
    let sample;
    for(let i = 10; i <  event.target.value.byteLength; i=i+3){

      

      if (i%30 == 1) {
        sample = pasrseToInt24(event.target.value.buffer.slice(i, i+3));
        console.log(sample + " microvolt");
      }
    }

    
  }
  const handleAccValueChanged = (event) => {
  //setAcceleration(event.target.value.getUint8(0));
  
  
    
    console.log("\n\nNew values");
    console.log(event.target.value);

    let ref_x = event.target.value.getInt8(11) * 256 + event.target.value.getInt8(10);
    let ref_y = event.target.value.getInt8(13) * 256 + event.target.value.getInt8(12);
    let ref_z = event.target.value.getInt8(15) * 256 + event.target.value.getInt8(14);
    console.log("x " + ref_x + " y " + ref_y + " z " + ref_z );

    let sample_x = ref_x + event.target.value.getInt8(18);
    let sample_y = ref_y + event.target.value.getInt8(19);
    let sample_z = ref_z + event.target.value.getInt8(20);
    console.log("x " + sample_x + " y " + sample_y + " z " + sample_z );
    
    
    for(let i = 21; i < 222; i=i+3){

      sample_x = sample_x + event.target.value.getInt8(i);
      sample_y = sample_y + event.target.value.getInt8(i+1);
      sample_z = sample_z + event.target.value.getInt8(i+2); 
      if (i%30 == 0) {
        console.log("x " + sample_x + " y " + sample_y + " z " + sample_z );
      }
    }

  }



  const cntChanged = (event) => {
    console.log(event.target.value)
  }


  const handleHRValueChanged = (event) => {
    bpm_normal.innerText = event.target.value.getUint8(1)
    
    if (lowest_bpm == undefined || lowest_bpm > event.target.value.getUint8(1)){
      lowest_bpm = event.target.value.getUint8(1);
      bpm_low.innerText = event.target.value.getUint8(1);
    } 
    if (highest_bpm == undefined || highest_bpm < event.target.value.getUint8(1)){
      highest_bpm = event.target.value.getUint8(1);
      bpm_high.innerText = event.target.value.getUint8(1);
    }

    //add alertbox
    //TODO: make it more fancy!!!
    if (event.target.value.getUint8(1) > 100){
      alert_box.style.display = "flex";
    } else {alert_box.style.display = "none";}

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
    console.log(props.device);
    console.log("1");
    navigator.bluetooth.requestDevice(options)
    .then(device => {
      setDevice(device);
      console.log("1");
      device.gatt.connect()
      .then(server => {
        setServer(server);
        console.log("1");
        server.getPrimaryServices()
        .then(services => {
          setServices(services); 
          console.log("1");
          services.forEach(element => {
            if (element.uuid === PMD_Service) {
              element.getCharacteristic(Cntrl_char).then(cntChar => {
                cntChar.startNotifications();
                cntChar.addEventListener("characteristicvaluechanged", cntChanged);
                cntChar.writeValueWithResponse(new Uint8Array([0x01, 0x01])).then(cntChar => {
                  startStream(services);
                })
                
                
                
              })
            }
          })
        })
      })
    })
  }
        // .then(char => {
        //   console.log(char);
        //   console.log(char.properties);
        //   char.addEventListener("characteristicvaluechanged", heartRateChanged);
        //   char.startNotifications();
        // })
        // service.getCharacteristic(Cntrl_char)
        // .then(char => {
        //   char.writeValueWithResponse(new Uint8Array([1, 0]))
        //   .then(value => {
        //     console.log(value);
        //   })
        //   char.writeValueWithResponse(new Uint8Array([2, 2, 0, 1, 0x34, 0, 1, 1, 0x10, 0, 2, 1, 8, 0, 4, 1, 3]));
        // })
 

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

const startStream = (services) => {
  console.log("täällä");
  console.log(device);
  console.log(server);
  console.log(services);
  
  services.forEach(element => {
    if (element.uuid === PMD_Service) {
      element.getCharacteristic(Data_char).then(dataChar => {
        dataChar.startNotifications();
        dataChar.addEventListener("characteristicvaluechanged", handleAccValueChanged);
        dataChar.addEventListener("characteristicvaluechanged", handleEcgValueChanged);
      }).then(_ => {
        element.getCharacteristic(Cntrl_char)
        .then(controlChar => {
          console.log(controlChar.properties);
          controlChar.writeValueWithResponse(ECG_Array);
        })
      });
    } if (element.uuid === Heart_rate_Service) {
        element.getCharacteristic(Heart_rate_Char)
        .then(heartRateChar => {
          console.log(heartRateChar);
          heartRateChar.startNotifications();
          heartRateChar.addEventListener("characteristicvaluechanged", handleHRValueChanged);
        })
    } if (element.uuid === Battery_Service) {
        element.getCharacteristic(Battery_Char)
        .then(char => {
          console.log(char.properties);
          char.readValue()
          char.addEventListener("characteristicvaluechanged", handleBatteryValueChanged);
        })
    }
  });
}


  return (
    
    <html>
      <head></head>
      <body>
        <header>
        <img src={require('../components/images/Simplefitlogo.png')} alt='' />
        <Clock styles ={clock.clock2}/>   
        </header>
        <div className={styles.content}>
          <p className={styles.alertBox} id="alertbox">watchout!</p>
          <section className={styles.dataContainer}>
            <button onClick={connectDevice}>Connect</button>
            <div>
              <p className={ styles.dataText } id="bpm_low" >n.a.</p>
              <p className={ styles.dataUnit }>Lowest BPM</p>
            </div>
            <div>
              <p className={ styles.dataText } id="bpm_normal">n.a.</p>
              <p className={ styles.dataUnit }>BPM</p>
            </div>
            <div>
              <p className={ styles.dataText } id="bpm_high" >n.a.</p>
              <p className={ styles.dataUnit }>Highest BPM</p>
            </div>
          </section> 
          
          <section className={ styles.graphContainer }>
              <div className={ styles.graph }>
                <IotChart/>
              </div>
              <p className={ styles.graphName }>ECG</p>
              

          </section>
        
        </div>
        <footer >
        
          
        </footer>
      </body>
    </html>
  );
}


export default App;
