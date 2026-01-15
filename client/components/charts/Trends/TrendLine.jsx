import { Meteor } from 'meteor/meteor';
import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';
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

// statType // 'newBatch', 'doneBatch', 'newNC', 'newSH'

const TrendLine = ({ 
  title, localXY,
  statType, cycleCount, cycleBracket,
  lineColor, isDebug
})=>{
  
  const thingMounted = useRef(true);
  const blank = [ {x:1,y:0} ];
  // const blank = Array(cycleCount);
  const [ data, dataSet ] = useState( blank );

  useEffect( ()=>{
    if(localXY && Array.isArray(localXY)) {
      dataSet(localXY);
    }else{
      Meteor.call('cycleWeekRate', statType, cycleCount, cycleBracket, (err, re)=>{
        err && console.log(err);
        isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
        re && thingMounted.current && dataSet(re);
      });
    }
    return () => { thingMounted.current = false };
  }, [localXY, cycleCount, cycleBracket]);
  
  return(
    <TrendLineChart
      data={data}
      cycleCount={cycleCount}
      lineColor={lineColor}
      title={title} />
  );
};

export default TrendLine;

export const TrendLineCache = ({ 
  title,
  statType, cycleCount,
  lineColor, isDebug
})=>{
  
  const thingMounted = useRef(true);
  const blank = [ {x:1,y:0} ];
  const [ data, dataSet ] = useState( blank );

  useEffect( ()=>{
    Meteor.call('cycleLiteRate', statType, cycleCount, (err, re)=>{
      err && console.log(err);
      isDebug && console.log(`${title}: ${JSON.stringify(re)}`);
      re && thingMounted.current && dataSet(re);
    });
    return () => { thingMounted.current = false };
  }, [localXY, cycleCount]);
  
  return(
    <TrendLineChart
      data={data}
      cycleCount={cycleCount}
      lineColor={lineColor}
      title={title} />
  );
};

const TrendLineChart = ({ data, cycleCount, lineColor, title })=> {
  
    const options = {
    responsive: true,
    elements: {
      line: {
        borderColor: lineColor || 'black',
        borderWidth: 1,
      },
      point: {
        radius: 0
      },
    },
    scales: {
      x: {
        type: 'time',
        ticks: {
          display: false
        }
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
      <Line options={options} data={{datasets:[{data:data,normalized: true}]}} />
      <div className='centreText smCap'>{title}</div>
    </div>
  );
};