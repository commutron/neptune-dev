import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip
);
import PrintThis from '/client/components/tinyUi/PrintThis';

const FailScatterChart = ({ 
  fetchFunc, idLimit,
  print, extraClass 
})=> {
  
  const mounted = useRef(true);
   
  const [ showZero, showZeroSet ] = useState(false);
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call(fetchFunc, idLimit, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(mounted.current) {
          tickXYSet(re);
        }
      }
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  const dataset = !tickXY ? [] : showZero ? tickXY : tickXY.filter(t=>t.y > 0);

  const options = {
    responsive: true,
    elements: {
      line: {
        backgroundColor: 'rgba(192, 57, 43,0.2)',
        borderColor: 'rgb(192, 57, 43)',
        fill: true,
        borderWidth: 2,
      },
      point: {
        backgroundColor: 'rgba(192, 57, 43,0.2)',
        borderColor: 'rgb(192, 57, 43)',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'MMM D YYYY'
        },
        offset: true
      },
      y: {
        type: 'linear',
        offset: true
      }
    },
    plugins: {
      title: {
        display: false
      },
      legend: false,
      tooltip: {
        callbacks: {
          label: (cntxt)=> cntxt.raw.z
        }
      }
    },
  };
  
  return(
    <div className={extraClass || ''}>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        <label className='beside gapL'>Zeros
          <input
            type='checkbox'
            className='minHeight gapL'
            defaultChecked={showZero}
            onChange={()=>showZeroSet(!showZero)} 
        /></label>
        {print && <PrintThis /> }
      </div>
      
      <div className='chart50vContain centre space'>
        <Bar 
          options={options} 
          data={{
            datasets:[
              {type:'bubble',data:dataset,normalized: true,pointHitRadius: 10},
              {type:'line',data:dataset,normalized: true,pointRadius:0,pointHitRadius:0}
            ]
          }} 
        />
      </div>
      
      <p className='centreText small'>Test Failures</p>
      <p className='grayT small'>
        Y axis is number of items that failed<br />
        Datapoint size is scaled by how many failures<br /> 
      </p>
    </div>
  );
};

export default FailScatterChart;

