import React, { useState, useEffect } from 'react';
import Pref from '/public/pref.js';

import { CalcSpin } from '/client/components/tinyUi/Spin';

import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import { toCap } from '/client/utility/Convert';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title, 
  Tooltip,
  Legend
);

const TideMultiBatchBar = ({ batchIDs, app, extraClass })=> {
  
  const [ batchTimes, storeTimes ] = useState(false);
  const [ tggl, tgglSet ] = useState(false);
  
  const [ series, seriesSet ] = useState([]);
  
  useEffect( ()=>{
    Meteor.call('countMultiBatchTideTimes', batchIDs, (error, reply)=>{
      error && console.log(error);
      storeTimes( reply );
    });
  }, [batchIDs]);
  
  useEffect( ()=>{
    if(batchTimes) {
      let dtsets = [];
      const addDt = (title, data, color)=> {
        dtsets.push({
          label: title,
          data: data.map( d => { return { y:d.y, x: tggl ? d.x / (d.z || 1) : d.x } },[]),
          backgroundColor: color,
          stack: 'stk'
        });
      };
      addDt('Recorded', batchTimes.batchTides, "rgb(52, 152, 219)");
      addDt('Remain', batchTimes.batchLeftBuffer, "rgb(149, 165, 166)");
      addDt('Over', batchTimes.batchOverBuffer, "rgb(241, 196, 15)");
      seriesSet(dtsets);
    }
  }, [batchTimes, tggl]);
  
  if(!batchTimes) {
    return(
      <CalcSpin />
    );
  }
  
  const options = {
    indexAxis: 'y',
    responsive: true,
    elements: {
      bar: {
        maxBarThickness: 3,
      },
    },
    scales: {
      x: {
        type: 'linear',
        ticks: {
          precision: 0
        },
        stacked: true
      },
      y: {
        type: 'category',
        labels: [],
        stacked: true,
        ticks: {
          callback: function(v) { 
            return toCap( this.getLabelForValue(v) || "" ); 
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (cntxt)=> `${cntxt.raw.x.toFixed(2)} Hours`
        }
      },
      title: false,
    },
  };
  
  if(batchTimes.batchTides.length > 0) {
    return(
      <div className={'chartNoHeightContain ' + extraClass || ''}>
      <div className='rowWrap noPrint'>
        <span className='flexSpace' />
        <ToggleSwitch 
          tggID='toggleQty'
          toggleLeft='Total Hours'
          toggleRight='Hours Per Item'
          toggleVal={tggl}
          toggleSet={tgglSet}
        />
      </div>
        <Bar options={options} data={{datasets:series}} />
        <div className='centreText small'>Duration in Hours</div>
      </div>
    );
  }
    
  return(
    <div className='centreText fade'>
      <i className='fas fa-ghost fa-2x grayT'></i>
      <p className='medBig cap'>no {Pref.xBatchs}</p>
    </div>
  );
};

export default TideMultiBatchBar;