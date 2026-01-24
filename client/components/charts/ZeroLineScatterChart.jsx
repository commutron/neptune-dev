import React from "react";
import moment from 'moment';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const ZeroLineScatterChart = ({ xy, fade, fill, normal })=> {
  
  const options = {
    responsive: true,
    elements: {
      line: {
        backgroundColor: fade || 'rgb(127, 140, 141, 0.5)',
        borderColor: fill || 'rgb(127, 140, 141)',
        fill: true,
        borderWidth: 2,
      },
      point: {
        backgroundColor: fill || 'rgb(127, 140, 141)',
        borderColor: fill || 'rgb(127, 140, 141)',
        pointHitRadius: 10,
        pointRadius: 3,
        pointStyle: 'rectRot'
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM D YYYY'
        },
      },
      y: {
        ticks: {
          precision: 2
        },
        grid: {
          color: (cntxt)=> cntxt.tick.value === 0 ? 'rgb(0,0,0)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (cntxt)=> cntxt.raw.z
        }
      }
    },
  };
  
  return(
    <div>
      <div className='space centreRow'>
        <Line 
          options={options} 
          data={{datasets:[{data:xy,normalized: normal === undefined ? true : normal}]}} 
        />
      </div>
      <p className='noPrint smaller rightText indentR grayT'>Right Click on chart to save as image to your computer</p>
    </div>
  );
};

export default ZeroLineScatterChart;