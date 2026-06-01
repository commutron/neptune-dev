import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
  BarElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  LineElement,
  BarElement
);

const NonConRate = ({ batch, title })=> {
  
  const [ counts, setCounts ] = useState( false );
  const [ totals, setTotals ] = useState( false );
  
  useEffect( ()=>{
    Meteor.call('nonConRateLoop', batch, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        setCounts( reply[0] );
        setTotals( reply[1] );
      }
    });
  }, []);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM D YYYY'
        }
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
  
  if(!counts || !totals) {
    return(
      <CalcSpin />
    );
  }
  
  return(
    <div className='space chart50vContain centre'>
      <Line 
        options={options} 
        data={{
          datasets:[
            {
              type:'bar',
              data:counts,
              normalized: true,
              pointHitRadius: 10,
              backgroundColor:'rgb(231, 76, 60)',
              borderColor:'rgb(231, 76, 60)'
            },
            {
              type:'line',
              data:totals,
              normalized: true,
              pointRadius:0,
              pointHitRadius:10,
              backgroundColor:'oklab(0.37 0.11 0.06)',
              borderColor:'oklab(0.37 0.11 0.06)',
              borderWidth: 3
            }
          ]
        }} />
      <p className='centreText small cap'>{title}</p>
      <p className='centreText small cap'><em>Bar shows logged on that day. Line shows the cumulative total.</em>{title}</p>
    </div>
  );
};

export default NonConRate;