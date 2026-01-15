import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeScale,
  LinearScale,
  LineElement,
  Filler,
);

const ProgLayerBurndown = ({ 
  batchId, seriesId, batchNum, start, floorRelease, end, riverFlow, 
  itemData, title, isDebug
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => { return () => { mounted.current = false; }; }, []);
  
  const [ countState, countSet ] = useState( false );
  const [ data, dataSet ] = useState({datasets:[]});
  
  const options = {
    responsive: true,
    elements: {
      point: {
        radius: 0
      },
      line: {
        backgroundColor: 'rgba(41, 128, 185, 0.2)',
        borderColor: 'rgb(41, 128, 185)',
        fill: true,
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
          precision: 2
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
 
  useEffect( ()=> {
    Meteor.call('layeredHistoryRate', batchId, seriesId, start, end, riverFlow, 
    (error, reply)=> {
      error && console.log(error);
      if(reply && mounted.current) {
        countSet( true );
        dataSet({datasets: reply});
      }
      isDebug && console.log(reply);
    });
  }, []);
  
  return(
    <div className='burndownFill'>
    <div className='rowWrap noPrint'>
      {!countState ?
        <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
        <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
      }
    </div>
    {countState &&
      
      <div className='space cap'>
        
        <Line options={options} data={data} />
        
        <div className='centreText smCap'>{title}</div>
        
      </div>
    }
    
      <details className='footnotes grayT small wide'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          The X axis is the percentage of counters and serialized items remaining.
        </p>
        <p className='footnote'>
          The Y axis starts with the batch creation date and ends with 
          either today or the batch complete day. Weekends are skipped 
          entirely.
        </p>
        <p className='footnote'>
          A step that was added mid-run might not reach zero because 
          finished items would have skipped recording that step.
        </p>
      </details>
    </div>
  );
};

export default ProgLayerBurndown;