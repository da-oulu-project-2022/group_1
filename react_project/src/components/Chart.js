
import {React, useRef, useEffect} from "react";
import { Line } from "react-chartjs-2";
import styles from './modules/Chart.module.css'
import Chart from "chart.js/auto";
import 'chartjs-adapter-luxon';
import { StreamingPlugin, RealTimeScale } from "chartjs-plugin-streaming";
Chart.register(StreamingPlugin, RealTimeScale);

//Chart base to visualize real-time BPM and ECG values.
export const IotChart = (props) => {

  const bpm = useRef(props.data);

  useEffect(() => {
    bpm.current = props.data;
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
            } else {
                console.log(props.data);
                data.current.datasets[0].data.push({
                  x: Date.now(),
                  y: bpm.current,
                });
            }
          },
          delay: 300,
          refresh: 300,
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


