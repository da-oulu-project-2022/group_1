import Clock from './Clock';
import { IotChart } from './Chart';
import styles from './modules/VeritySense.module.css';
import clockStyles from './modules/Clock.module.css';
import React, { useEffect, useRef, useState } from 'react';   
import { GoAlert } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

function VeritySense(props) {
  // Initializing some constant gatt service uuids
  const PMD_Service = "fb005c80-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Service = "0000180d-0000-1000-8000-00805f9b34fb";
  const Battery_Service = "0000180f-0000-1000-8000-00805f9b34fb";

  // Initializing some constant gatt service characteristic uuids
  const Cntrl_char = "fb005c81-02e7-f387-1cad-8acd2d8df0c8";
  const Data_char = "fb005c82-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Char = "00002a37-0000-1000-8000-00805f9b34fb";
  const Battery_Char = "00002a19-0000-1000-8000-00805f9b34fb";

  const ACC_Array = new Uint8Array([0x02, 0x02, 0x00, 0x01, 0x34, 0x00, 0x01, 0x01, 0x10, 0x00, 0x02, 0x01, 0x08, 0x00, 0x04, 0x01, 0x03]);
  const PPI_Array = new Uint8Array([0x02, 0x03]);

  const navigate = useNavigate();

  let bpm_normal;
  let bpm_high;
  let bpm_low;
  let alert_box;
  let [bpm_now, setBpm] = useState();
  let [ppi_now, setPpi] = useState();

  let [style, setStyle] = useState(styles.body);
  let [theme, setTheme] = useState('light');
  let [containerStyle, setContainerStyle] = useState(styles.dataContainer);
  let [buttonContainer, setButtonContainer] = useState(styles.buttonContainer);

  let [dataUnit, setDataUnit] = useState(styles.dataUnit);

  let lowest_bpm;
  let highest_bpm;  

  useEffect(() => {
    bpm_normal = document.getElementById("bpm_normal");
    bpm_high = document.getElementById("bpm_high");
    bpm_low = document.getElementById("bpm_low");
    alert_box = document.getElementById("alertbox");
    startMeasurement();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Update the value shown on the web page when a notification is received.

  const handleBatteryValueChanged = (event) => {
    //setBatteryLevel(event.target.value.getUint8(0) + '%');
    console.log("Batterylevel: " + event.target.value.getUint8(0) + '%');
  }

  const handlePmdDataValueChanged = (event) => {
    if (event.target.value.getUint8(0) === 2) {
  /* console.log("\n\nNew values");
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
      } */
      
    } else if (event.target.value.getUint8(0) === 3) {
      let sample = pasrseToInt16(event.target.value.buffer.slice(11, 13));
      console.log(sample);
      setPpi(sample);
    }
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


  const handleHRValueChanged = (event) => {
    setBpm(event.target.value.getUint8(1));
    bpm_normal.innerText = event.target.value.getUint8(1);
      
    if (lowest_bpm == undefined || lowest_bpm > event.target.value.getUint8(1)){
      lowest_bpm = event.target.value.getUint8(1);
      bpm_low.innerText = event.target.value.getUint8(1);
        
    }

    if (highest_bpm == undefined || highest_bpm < event.target.value.getUint8(1)){
      highest_bpm = event.target.value.getUint8(1);
      bpm_high.innerText = event.target.value.getUint8(1);
        
    }
      if (event.target.value.getUint8(1) > 200){
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
  /*       if (element.uuid === PMD_Service) {
          element.getCharacteristic(Data_char).then(dataChar => {
            dataChar.startNotifications();
            dataChar.addEventListener("characteristicvaluechanged", handlePmdDataValueChanged);
          }).then(_ => {
            element.getCharacteristic(Cntrl_char)
            .then(controlChar => {
              controlChar.writeValueWithResponse(PPI_Array)
              .then(_ => {
                controlChar.writeValueWithResponse(ACC_Array);
              });
            })
          })
        } */ if (element.uuid === Heart_rate_Service) {
            element.getCharacteristic(Heart_rate_Char)
            .then(heartRateChar => {
              heartRateChar.startNotifications();
              heartRateChar.addEventListener("characteristicvaluechanged", handleHRValueChanged);
            })
        } if (element.uuid === Battery_Service) {
            element.getCharacteristic(Battery_Char)
            .then(char => {
              char.readValue()
              char.addEventListener("characteristicvaluechanged", handleBatteryValueChanged);
            })
        }
      })
    })
  }


  // Handling the onClick event of change theme button, updates state objects: style, dataUnit and theme
  // with set function of each of these objects which triggers re-rendering of the page.
  const handleThemeChange = () => {
    if (theme === 'light') {
      setStyle(styles.bodyDark);
      setDataUnit(styles.dataUnitDark);
      setContainerStyle(styles.dataContainerDark);
      setButtonContainer(styles.buttonContainerDark);
      setTheme('dark');
    } else {
      setStyle(styles.body);
      setDataUnit(styles.dataUnit);
      setContainerStyle(styles.dataContainer);
      setButtonContainer(styles.buttonContainer);
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
    
    <html>
      <head></head>
      <div className={style}>
        <header>
        <img style={{height: 70, width: 300}} src={require('../components/images/Simplefitlogo.png')} alt=''/>
          <Clock styles={clockStyles.clock2}/>   
        </header>
        <div className={styles.content}>
          <p className={styles.alertBox} id="alertbox"><GoAlert/> Heart rate too high!</p>
          <section className={containerStyle}>
          
            <div>
              <p className={styles.dataText} id="bpm_low" >0</p>
              <p className={dataUnit}>Lowest BPM</p>
            </div>
            <div>
              <p className={styles.dataText} id="bpm_normal">0</p>
              <p className={dataUnit}>BPM</p>
            </div>
            <div>
              <p className={styles.dataText} id="bpm_high" >0</p>
              <p className={dataUnit}>Highest BPM</p>
            </div>
          </section> 
          
          <section className={ styles.graphContainer }>
          
          <p className={styles.alertBox} id="alertbox"><GoAlert/> Heart rate too high!</p>
              <p className={ styles.graphName }>BPM</p>
              <div className={ styles.graph }>
              <IotChart data={bpm_now}/>
              </div>

              <p>{ppi_now}</p>
          </section>

          <section className={buttonContainer}>
          <button className={styles.button}onClick={disconnectDevice}>Disconnect Device</button>
          <button className={styles.button} onClick={handleThemeChange}> Change theme </button>


          </section>
          
        </div>
        <footer >
          
          
        </footer>
      </div>
    </html>
  );
}


export default VeritySense;