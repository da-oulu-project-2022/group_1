//live chart with dummy data

import React from "react";
import { Line } from "react-chartjs-2";
import styles from './modules/Chart.module.css'
import Chart, { registry } from "chart.js/auto";
import 'chartjs-adapter-luxon';
import registerables, { StreamingPlugin, RealTimeScale } from "chartjs-plugin-streaming";
Chart.register(StreamingPlugin, RealTimeScale);

export const IotChart = () => {

  const data = {
    datasets: [

      
      {
        label: "Dataset 1",
        data: [Math.random() * 100],

        fill: false,
        backgroundColor: 'rgb(255,255,255)',
        lineTension: 0.1,
        borderColor: "#f44336",
        borderJoinStyle: "miter",
        pointRadius: 0,
        showLine: true,
        
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "realtime",
        realtime: {
          onRefresh: function() {
            data.datasets[0].data.push({
              x: Date.now(),
              y: Math.random() * 100,
            });
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
        <Line data={data} options={options} className={styles.chartBackground} />
        
      </div>
    </div>
  );
};
