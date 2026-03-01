import React, { useState, useEffect } from "react";
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

const ScatterCH = ({ strdata, multidata, title, fillColor, area, intgr })=> {
  
  const [ data, dataSet ] = useState({datasets:[]});
  
  const options = {
    responsive: true,
    elements: {
      line: {
        backgroundColor: fillColor || 'rgb(127, 140, 141, 0.5)',
        borderColor: fillColor || 'rgb(127, 140, 141, 0.5)',
        fill: area !== undefined ? area : true,
        borderWidth: 5,
      },
      point: {
        backgroundColor: fillColor || 'rgb(127, 140, 141)',
        borderColor: fillColor || 'rgb(127, 140, 141)',
        pointHitRadius: 10,
        pointRadius: 3
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
          precision: intgr ? 0 : 2
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title || '',
      },
      tooltip: {
        callbacks: {
          label: (cntxt)=> `${cntxt.raw.z || ''}${cntxt.raw.y}`
        }
      }
    },
  };

  useEffect( ()=> {
    dataSet({datasets:[]});
    if(multidata) {
      dataSet({
        datasets: multidata.map( (d)=>{ 
          return {
            label: d.data_name,
            data: d.data_array,
            backgroundColor: d.data_color,
            borderColor: d.data_color,
            normalized: true
          };
        })
      });
    }else{
      dataSet({
        datasets: [{ 
          label: title || 'set1',
          data: strdata || [],
          normalized: true
        }]
      });
    }
  }, [strdata, multidata]);
    
  return(
    <div>
      <div className='chart50vContain centreRow'>
        <Line options={options} data={data} />
      </div>
      <p className='noPrint smaller rightText indentR grayT'>Right Click on chart to save as image to your computer</p>
    </div>
  );
};

export default ScatterCH;