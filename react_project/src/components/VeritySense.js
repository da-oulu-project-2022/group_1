import Clock from './Clock';
import { IotChart } from './Chart';
import styles from './modules/VeritySense.module.css';
import clockStyles from './modules/Clock.module.css';
import React, { useEffect, useRef, useState } from 'react';   

function VeritySense(props) {
  const PMD_Service = "fb005c80-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Service = "0000180d-0000-1000-8000-00805f9b34fb";
  const Battery_Service = "0000180f-0000-1000-8000-00805f9b34fb";

  const Cntrl_char = "fb005c81-02e7-f387-1cad-8acd2d8df0c8";
  const Data_char = "fb005c82-02e7-f387-1cad-8acd2d8df0c8";
  const Heart_rate_Char = "00002a37-0000-1000-8000-00805f9b34fb";
  const Battery_Char = "00002a19-0000-1000-8000-00805f9b34fb";

  const ACC_Array = new Uint8Array([0x02, 0x02, 0x00, 0x01, 0x34, 0x00, 0x01, 0x01, 0x10, 0x00, 0x02, 0x01, 0x08, 0x00, 0x04, 0x01, 0x03]);
  const PPI_Array = new Uint8Array([0x02, 0x03]);

  let bpm_normal;
  let bpm_high;
  let bpm_low;
  let alert_box;
  let [bpm_now, setBpm] = useState();

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

  /**
   * Update the value shown on the web page when a notification is
   * received.
   */

  const handleBatteryValueChanged = (event) => {
    //setBatteryLevel(event.target.value.getUint8(0) + '%');
    console.log("Batterylevel: " + event.target.value.getUint8(0) + '%');
  }

  const handlePmdDataValueChanged = (event) => {
    if (event.target.value.getUint8(0) === 2) {
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


  const handleHRValueChanged = (event) => {
    console.log(event.target.value.getUint8(1));
    bpm_normal.innerText = event.target.value.getUint8(1);
    setBpm(event.target.value.getUint8(1));
    
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
      } else {
        alert_box.style.display = "none";
      }
  }

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
            controlChar.writeValueWithResponse(PPI_Array)
            .then(_ => {
              console.log(controlChar.properties);
              controlChar.writeValueWithResponse(ACC_Array);
            });
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


  return (
    
    <html>
      <head></head>
      <body>
        <header>
          <Clock styles={clockStyles.clock2}/>   
        </header>
        <div className={styles.content}>
          <p className={styles.alertBox} id="alertbox">watchout!</p>
          <section className={styles.dataContainer}>
            {/* <button onClick={connectDevice}>coonnect</button> */}
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
              <IotChart data={bpm_now}/>
              </div>
              <p className={ styles.graphName2 }>ECG</p>
          </section>
        </div>
        <footer >
          <img style={{height: 70, width: 300}} src={require('../components/images/Simplefitlogo.png')} alt=''/>
          
        </footer>
      </body>
    </html>
  );
}


export default VeritySense;