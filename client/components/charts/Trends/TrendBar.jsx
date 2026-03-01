import { Meteor } from 'meteor/meteor';
import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  BarElement
);

const TrendBar = ({ title, statType, cycleCount, cycleBracket, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  const [ dataG, dataGSet ] = useState( blank );
  const [ dataNG, dataNGSet ] = useState( blank );
  
  useEffect( ()=>{
    Meteor.call('cycleWeekRate', statType, cycleCount, cycleBracket, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
          const barOne = Array.from(re, w => { return { x: w.x, y: w.y[0] } } );
          const barTwo = Array.from(re, w => { return { x: w.x, y: w.y[1] } } );
          dataGSet(barOne);
          dataNGSet(barTwo);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <TrendBarChart
      dataG={dataG}
      dataNG={dataNG}
      cycleCount={cycleCount}
      title={title} />
  );
};

export default TrendBar;

export const TrendBarCache = ({ title, statType, cycleCount, cycleBracket, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  const [ dataG, dataGSet ] = useState( blank );
  const [ dataNG, dataNGSet ] = useState( blank );
  
  useEffect( ()=>{
    Meteor.call('cycleLiteRate', statType, cycleCount, (err, re)=>{
      err && console.log(err);
      if(re && re.length > 0) {
        if(thingMounted.current) {
          isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
          const barOne = Array.from(re, w => { return { x: w.x, y: w.y[0] } } );
          const barTwo = Array.from(re, w => { return { x: w.x, y: w.y[1] } } );
          dataGSet(barOne);
          dataNGSet(barTwo);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <TrendBarChart
      dataG={dataG}
      dataNG={dataNG}
      cycleCount={cycleCount}
      title={title} />
  );
};

const TrendBarChart = ({ dataG, dataNG, cycleCount, title })=> {

  const options = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: 'time',
        ticks: {
          display: false
        },
        time: {
          unit: 'week'
        },
      },
      y: {
        ticks: {
          precision: 1,
          display: false
        },
        grid: {
          display: false
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        display: false
      }
    },
  };
  
  return(
    <div className='chart20Contain'>
      <Bar 
        options={options} 
        data={{datasets:[
          {data:dataG,normalized: true,stack: 'stk', backgroundColor:"rgb(46, 204, 113)"},
          {data:dataNG,normalized: true,stack: 'stk', backgroundColor:"rgb(241, 196, 15)"}
        ]}} 
        redraw={true}
      />
      <div className='centreText smCap'>{title}</div>
    </div>
  );
};