import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  PointElement,
  Title,
  Tooltip
);
import { toCap } from '/client/utility/Convert.js';

const ShortScatter = ({ shortfalls, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ yArr, ySet ] = useState([]);
  
  useEffect( ()=> {
    const partNums = [...new Set(Array.from(shortfalls, x=> x.partNum))];
    ySet(partNums);
    
    let shCounts = [];
   
    for(let sh of shortfalls) {
      for(let ref of sh.refs) {
        shCounts.push({
          x: ref,
          y: sh.partNum,
          
        });
      }
    }
    seriesSet(shCounts);
    
  }, []);
  
  const options = {
    responsive: true,
    elements: {
      point: {
        backgroundColor: 'rgba(243,156,18,0.2)',
        borderColor: 'rgba(243,156,18)',
        pointRadius: 16,
        pointHitRadius: 16,
        pointStyle: "triangle"
      },
    },
    scales: {
      x: {
        type: 'category',
        offset: true,
        ticks: {
          callback: function(v) { 
            return toCap( this.getLabelForValue(v) || "" ); 
          }
        }
      },
      y: {
        type: 'category',
        labels: yArr,
        offset: true,
        ticks: {
          callback: function(v) { 
            return toCap( this.getLabelForValue(v) || "" ); 
          }
        }
      }
    },
    plugins: {
      title: false,
      legend: false
    },
  }; 

  isDebug && console.log({series, yNum});
    
  return(
    <div className='chartNoHeightContain up'>
      <div className='chart50vContain centreRow'>
        <Scatter options={options} data={{datasets: [{data: series}]}} redraw={true} />
      </div>
      <p className='centreText small cap'>Short Parts and Referances</p>
      
    </div>
  );
};

export default ShortScatter;