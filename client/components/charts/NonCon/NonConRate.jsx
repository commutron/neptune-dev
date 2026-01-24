import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  LineElement
);

const NonConRate = ({ batches, title, lineColor })=> {
  
  const [ ratesC, setCount ] = useState( false );
  
  useEffect( ()=>{
    Meteor.call('nonConRateLoop', batches, (error, reply)=>{
      error && console.log(error);
      reply && setCount( reply.flat() );
    });
  }, [batches]);

  const options = {
    responsive: true,
    elements: {
      point: {
        radius: 0
      },
      line: {
        backgroundColor: lineColor,
        borderColor: lineColor,
        borderWidth: 3,
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
          precision: 1
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
    },
  };
  
  if(!ratesC) {
    return(
      <CalcSpin />
    );
  }
  
  return(
    <div className='space chart50vContain centre'>
      <Line options={options} data={{datasets:[{data:ratesC,normalized: true}]}} />
      <p className='centreText small cap'>{title}</p>
    </div>
  );
};

export default NonConRate;