import React, { useState, useEffect } from "react";
// import Pref from '/client/global/pref.js';
// import { countMulti } from '/client/utility/Arrays';

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

const NonConCrossCH = ({ rawdata, dateString, branch })=> {
  
  const brAll = !branch || branch === 'ALL';
  
  const [ data, dataSet ] = useState({labels:[], datasets:[]});
  
  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: brAll,
        position: 'top'
      },
      title: {
        display: true,
        text: branch + ' NonCon Types ' + '(' + dateString + ')',
      },
    },
  };

  useEffect( ()=> {
    const labels = rawdata.map( (d)=> d[0] ).filter(f=>f);
    const lastIndex = rawdata[0].length - 1;
  
    dataSet({
      labels,
      datasets: rawdata[0].map( (d, i)=>{ 
        if(i !== 0 && (brAll ? i !== lastIndex : true)) {
          const clrshift = "hsl(5.61deg 78.08% " + (5 + (i*5)) + "%)";
          return {
            label: d,
            data: rawdata.map((r, x) => x !== 0 && r[i]).filter(f=> f !== false),
            backgroundColor: clrshift
          };
        }else{
          return;
        }
      }).filter(f=>f)
    });
  }, [rawdata]);
    
  return(
    <div>
      <div className='chart50vContain centreRow'>
        <Bar options={options} data={data} />
      </div>
      <p className='noPrint smaller rightText indentR grayT'>Right Click on chart to save as image to your computer</p>
    </div>
  );
};

export default NonConCrossCH;