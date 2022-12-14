
import {React, useRef, useEffect} from "react";
//live chart with dummy data
import { Line } from "react-chartjs-2";
import styles from './modules/Chart.module.css'
import Chart from "chart.js/auto";
import 'chartjs-adapter-luxon';
import { StreamingPlugin, RealTimeScale } from "chartjs-plugin-streaming";
Chart.register(StreamingPlugin, RealTimeScale);

    let bpm_array = new Array;

let i = 0;

//Chart base to visualize real-time BPM and ECG values.
export const IotChart = (props) => {

  const bpm = useRef(props.data);
  //console.log(props.data);

  useEffect(() => {
    bpm.current = props.data;
    if(bpm.current != undefined){
        bpm_array = bpm_array.concat(bpm.current);
    }

    console.log(bpm_array);
  })

  const data = useRef({
    datasets: [
      {
        label: "Dataset 1",
        data: [0],

        fill: false,
        backgroundColor: 'rgb(255,255,255)',
        lineTension: 0.1,
        borderColor: "#f44336",
        borderJoinStyle: "miter",
        pointRadius: 0,
        showLine: true,
        
      },
    ],
  });

  const options = {
    scales: {
      x: {
       
        
        type: "realtime",
        realtime: {
          onRefresh: function() {
            if (props.data === undefined) {
                data.current.datasets[0].data.push({
                    x: Date.now(),
                    y: 0,
                });
            }
            else {
              if(bpm.length > 50000){
                bpm_array.length = 0;
                i = 0;
              } 
              //for(let i = 0; i < bpm.current.length; i++){
              data.current.datasets[0].data.push({
                  x: Date.now(),
                  y: bpm_array.at(i),
              }); 
              i++;
            }
          },
          delay: 0,
          refresh: 0,
        },
      },
    }
  }

  return (
    <div>
      <div>
        <Line data={data.current} options={options} className={styles.chartBackground} />
        
      </div>
    </div>
  );
};


