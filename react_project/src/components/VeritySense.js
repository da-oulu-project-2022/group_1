import Clock from './Clock';
import { IotChart } from './Chart';
import styles from './modules/VeritySense.module.css';
import clockStyles from './modules/Clock.module.css';
import React, { useEffect, useState } from 'react';   
import { GoAlert } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

function VeritySense(props) {
  // Initializing some constant gatt service uuids
  const Heart_rate_Service = "0000180d-0000-1000-8000-00805f9b34fb";
  const Battery_Service = "0000180f-0000-1000-8000-00805f9b34fb";

  // Initializing some constant gatt characteristic uuids
  const Heart_rate_Char = "00002a37-0000-1000-8000-00805f9b34fb";
  const Battery_Char = "00002a19-0000-1000-8000-00805f9b34fb";


  // Declaring some variables for bpm, alert box and a state variable to save current bpm
  let bpm_normal;
  let bpm_high;
  let bpm_low;
  let alert_box;

  // Initializing data to send to chart
  let [bpm_now, setBpm] = useState();

  // Some state variables used in change theme feature
  let [style, setStyle] = useState(styles.body);
  let [theme, setTheme] = useState('light');

  let [dataContainerStyle, setContainerStyle] = useState(styles.dataContainer);
  let [buttonContainerStyle, setButtonContainer] = useState(styles.buttonContainer);

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


  // Function for handeling batterylevelchange events
  const handleBatteryValueChanged = (event) => {
    //setBatteryLevel(event.target.value.getUint8(0) + '%');
    console.log("Batterylevel: " + event.target.value.getUint8(0) + '%');
  }


  // Handling the event of heartrate characteristic value changing
  // firstly setting state variable bpm_now with setBpm to current the current event.target.value
  // then updating the bpm_normal element innertext to show current bpm value and doing some checking with the values of lowest and 
  // highest bpm values
  // lastly showing alert box if bpm goes over 100
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
        if (element.uuid === Heart_rate_Service) {
            element.getCharacteristic(Heart_rate_Char)
            .then(heartRateChar => {
              heartRateChar.startNotifications();
              heartRateChar.addEventListener("characteristicvaluechanged", handleHRValueChanged);
            })
        } 
        if (element.uuid === Battery_Service) {
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
          <section className={dataContainerStyle}>
          
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
              
              <div className={ styles.graph }>
              <IotChart data={bpm_now}/>
              </div>

              <p className={ styles.graphName }>BPM</p>
              

          </section>

          <section className={buttonContainerStyle}>
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