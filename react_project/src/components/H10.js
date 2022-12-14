
import './modules/Connect.module.css';
import Clock from './Clock.js';
import { GoAlert } from "react-icons/go";
import BarChart, { IotChart } from './ChartECG';
import styles from './modules/H10.module.css';
import clockStyles from './modules/Clock.module.css';
import React, { useState, useEffect } from 'react'; 

import { useNavigate } from 'react-router-dom';
/* import { Chart } from "react-google-charts";
 */
function H10(props) {
  // Initializing some constant gatt service uuids
  const PMD_Service = "fb005c80-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Service = "0000180d-0000-1000-8000-00805f9b34fb";
  const Battery_Service = "0000180f-0000-1000-8000-00805f9b34fb";

  // Initializing some constant gatt characteristic uuids
  const Cntrl_char = "fb005c81-02e7-f387-1cad-8acd2d8df0c8";
  const Data_char = "fb005c82-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Char = "00002a37-0000-1000-8000-00805f9b34fb";
  const Battery_Char = "00002a19-0000-1000-8000-00805f9b34fb";

  const navigate = useNavigate();

  // Initializing the nessecary start-stream-requests
  const ECG_Array = new Uint8Array([0x02, 0x00, 0x00, 0x01, 0x82, 0x00, 0x01, 0x01, 0x0E, 0x00]);
  const ACC_Array = new Uint8Array([0x02, 0x02, 0x02, 0x01, 0x08, 0x00, 0x00, 0x01, 0xC8, 0x00, 0x01, 0x01, 0x10, 0x00]);

  // Declaring some variables for bpm, alert box and a state variable to save current bpm
  let bpm_normal;
  let bpm_high;
  let bpm_low;
  let alert_box;
  
  // Initializing data to send to chart
  let [ecg_now, setEcg] = useState();

  let [style, setStyle] = useState(styles.body);
  let [theme, setTheme] = useState('light');
  let [dataContainerStyle, setDataContainerStyle] = useState(styles.dataContainer);
  let [buttonContainerStyle, setButtonContainerStyle] = useState(styles.buttonContainer);
  

  let [dataUnit, setDataUnit] = useState(styles.dataUnit);

  // Variables for highest and lowest bpm of current session
  let lowest_bpm;
  let highest_bpm;  

  // UseEffect hook for initializing some html elements and starting the measurements on polar sensor
  // runs only on the first render by declaring an empty array dependency as second parameter
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    bpm_normal = document.getElementById("bpm_normal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    bpm_high = document.getElementById("bpm_high");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    bpm_low = document.getElementById("bpm_low");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    alert_box = document.getElementById("alertbox");
    startMeasurement();
  }, []);

  /**
   * Update the value shown on the web page when a notification is
   * received.
   */

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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

  function pasrseToInt16(byte_array){
    let m_array = new Uint8Array(byte_array)
    let value0 = m_array[0].toString(16)
    if (value0.length == 1){ value0 = 0 + value0}
    let value1 = m_array[1].toString(16)
    if (value1.length == 1){ value1 = 0 + value1}
    let value = value1 + value0;
    value = parseInt(value, 16);
    
    if (value > 32767) { value = value - 65536 };
    return value;
  }

  const handleBatteryValueChanged = (event) => {
    //setBatteryLevel(event.target.value.getUint8(0) + '%');
    console.log("Batterylevel: " + event.target.value.getUint8(0) + '%');
  }


  // Function for handeling the PMD-Data-Value change event
  // checks which type of dataframe is recives (eg. ECG or ACC)
  const handlePmdDataValueChanged = (event) => {
    if (event.target.value.getUint8(0) === 0) {
      console.log("\n\nNew values");
      console.log(event.target.value);
      let sample;
      let sample_array = new Array;
      console.log("start");
      for(let i = 10; i <  event.target.value.byteLength; i=i+3){
        sample = pasrseToInt24(event.target.value.buffer.slice(i, i+3));
        //sample_array.push(sample);
        //await sleep(1);
        //setTimeout(setEcg(sample), 150);
        //setEcg(sample);
        sample_array.push(sample);

      }
      setEcg(sample_array);
      console.log("finisched");
      //setEcg(sample_array);
      
    }
    else if (event.target.value.getUint8(0) === 2) {
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
      
    } else if (event.target.value.getUint8(0) === 3) {
      console.log(event);
    }
  }

  // Handling the event of heartrate characteristic value changing
  // firstly setting state variable bpm_now with setBpm to current the current event.target.value
  // then updating the bpm_normal element innertext to show current bpm value and doing some checking with the values of lowest and 
  // highest bpm values
  // lastly showing alert box if bpm goes over 100
  const handleHRValueChanged = (event) => {
    console.log(event.target.value.getUint8(1));
    bpm_normal.innerText = event.target.value.getUint8(1);
  
    if (lowest_bpm == undefined || lowest_bpm > event.target.value.getUint8(1)){
      lowest_bpm = event.target.value.getUint8(1);
      bpm_low.innerText = event.target.value.getUint8(1);
    } 
    if (highest_bpm == undefined || highest_bpm < event.target.value.getUint8(1)){
      highest_bpm = event.target.value.getUint8(1);
      bpm_high.innerText = event.target.value.getUint8(1);
    }
    if (event.target.value.getUint8(1) > 100){
      alert_box.style.display = "flex";
    } else {
      alert_box.style.display = "none";
    }
  }


  // Starts the data streams from polar device by first getting the "device" from props which is passed down from App.js
  // then searching for the needed services from "device.gatt" meaning the device server
  const startMeasurement = () => {
    props.device.gatt.getPrimaryServices()
    .then(services => { 
      services.forEach(element => {
        if (element.uuid === PMD_Service) {
          element.getCharacteristic(Data_char).then(dataChar => {
            dataChar.startNotifications();
            dataChar.addEventListener("characteristicvaluechanged", handlePmdDataValueChanged);
          }).then(_ => {
            element.getCharacteristic(Cntrl_char)
            .then(controlChar => {
              console.log(controlChar.properties);
              controlChar.writeValueWithResponse(ECG_Array)
  /*             .then(_ => {
                console.log(controlChar.properties);
                controlChar.writeValueWithResponse(ACC_Array);
              }); */
            })
          })

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
      })
    })
  }

  const handleStyleChange = () => {
    if (theme === 'light') {
      setStyle(styles.bodyDark);
      setDataUnit(styles.dataUnitDark);
      setDataContainerStyle(styles.dataContainerDark);
      setButtonContainerStyle(styles.buttonContainerDark);
      setTheme('dark');
    } else {
      setStyle(styles.body);
      setDataUnit(styles.dataUnit);
      setDataContainerStyle(styles.dataContainer);
      setButtonContainerStyle(styles.buttonContainer);
      setTheme('light');
    }
  }

  const disconnectDevice = () => {
    if (props.device.gatt.connected) {
      props.device.gatt.disconnect();
      alert("Bluetooth device disconnected");
      navigate('/');
    }
  }


  return (
  
    <div>
      
      <div className={style}>
      
        <header>
        <img style={{height: 70, width: 300}} src={require('../components/images/Simplefitlogo.png')} alt=''/>
          <Clock styles={clockStyles.clock2}/>   
        </header>
        
        <div className={styles.content}>
          
          <section className={dataContainerStyle}>
          
            {/* <button onClick={connectDevice}>coonnect</button> */}
            <div>
              <p className={ styles.dataText } id="bpm_low" >n.a.</p>
              <p className={ dataUnit }>Lowest BPM</p>
            </div>
            <div>
              <p className={ styles.dataText } id="bpm_normal">n.a.</p>
              <p className={ dataUnit }>BPM</p>
            </div>
            <div>
              <p className={ styles.dataText } id="bpm_high" >n.a.</p>
              <p className={ dataUnit }>Highest BPM</p>
            </div>
          </section> 
          
          <section className={ styles.graphContainer }>
            <div className={styles.alertBox} id="alertbox">
              <p className={styles.alertIcon}><GoAlert/></p>
              <p className={styles.alertText}>Heart rate too high!</p>
              </div>
            <div className={ styles.graph }>
            <IotChart data={ecg_now}/>
            </div>
            <p className={ styles.graphName }>ECG</p>
          </section>

          <section className={buttonContainerStyle}>
            <button className={styles.button}onClick={disconnectDevice}>Disconnect Device</button>
            <button className={styles.button} onClick={handleStyleChange}> Change theme </button>
            
          </section>
          
        </div>
        <footer >
          
          
        </footer>
      
      </div>
    </div>
  );
}


export default H10;



