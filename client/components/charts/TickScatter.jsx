import React, { useState, useEffect } from "react";
import moment from 'moment';

import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip
);

const TickScatter = ({ waterfall, rapidsData })=> {
  
  const [ tickXY, tickXYSet ] = useState([]);
  
  useEffect( ()=> {
    let allfalls = [];
    allfalls.push( waterfall );
    for(let cas of rapidsData) {
      allfalls.push( cas.cascade );
    }
    const flatfalls = allfalls.flat();
    
    let wipFallTicks = [];
    for( let fall of flatfalls ) {
      fall.counts.map( (tick, index)=>{ 
        if(tick.tick > 0) {
          for(let t = tick.tick; t > 0; t--) {
            wipFallTicks.push({
              x: tick.time, 
              y: index+t
            });
          }
        }
      });
    }
    tickXYSet(wipFallTicks);
  }, []);
  
  const options = {
    responsive: true,
    elements: {
      point: {
        backgroundColor: 'dimgray',
        borderColor: 'dimgray',
        pointRadius: 6,
        pointHitRadius: 10
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM D'
        },
        offset: true,
      },
      y: {
        type: 'linear',
        display: false,
        offset: true,
      }
    },
    plugins: {
      title: false,
      legend: false
    },
  };
  
  return(
    <div className='chartNoHeightContain'>
      <div className='chart50vContain centreRow'>
        <Scatter options={options} data={{datasets:[{data:tickXY}]}} />
      </div>
    </div>
  );
};

export default TickScatter;