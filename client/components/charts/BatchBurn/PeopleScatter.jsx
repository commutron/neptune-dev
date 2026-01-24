import React, { useState, useEffect } from "react";
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

import UserName from '/client/utility/Username.js';
// import { toCap } from '/client/utility/Convert.js';

const PeopleScatter = ({ tide, period, xform, xlabel, isDebug })=> {
  
  const [ data, dataSet ] = useState({datasets:[]});
  const [ uUsers, uUsersSet ] = useState([]);
  const [ uCols, uColsSet ] = useState([]);
  
  useEffect( ()=> {
    const tideArr = tide || [];
    
    let wt = [];
  
    for(let t of tideArr) {
      wt.push({
        x: moment(t.startTime).startOf(period).format(xlabel),
        a: moment(t.startTime).startOf(period).toISOString(),
        y: UserName(t.who, true)
      });
    }
    
    const slim = _.uniq(wt, n=> n.a + n.y );
    const slimS = slim.sort((a,b)=> a.a > b.a ? 1 : a.a < b.a ? -1 : 0);
    
    uUsersSet( _.uniq(slim, n=> n.y ).map( c => c.y ) );
    
    uColsSet( _.uniq(slimS, n=> n.a ).map( c => c.x ) );
    
    dataSet({
      datasets: [{data: slimS}]
    });
  }, [tide]);
  

  const options = {
    responsive: true,
    elements: {
      point: {
        backgroundColor: 'rgb(41, 128, 185)',
        borderColor: 'rgb(41, 128, 185)',
        pointRadius: 6,
        pointHitRadius: 10
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: uCols,
        offset: true,
      },
      y: {
        type: 'category',
        labels: uUsers,
        offset: true,
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'People Active',
      },
      legend: false
    },
  };

  isDebug && console.log({data, uUsers, uCols});
    
  return(
    <div className='chartNoHeightContain'>
      <div className='chart50vContain centreRow'>
        <Scatter options={options} data={data} redraw={true} />
      </div>
      <p className='noPrint smaller rightText indentR grayT'>Right Click on chart to save as image to your computer</p>
    
      <details className='footnotes wide grayT small'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          If no time was recorded the day is skipped 
        </p>
        <p className='footnote'>
          People are listed in no particular order. Date order takes precedence.
        </p>
      </details>
    </div>
  );
};

export default PeopleScatter;