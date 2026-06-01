import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  PointElement,
  Title,
  Tooltip
);
import { countMulti } from '/client/utility/Arrays';
import { toCap } from '/client/utility/Convert';

const NonConBubble = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ wheres, wheresSet ] = useState([]);
  const [ types, typesSet ] = useState([]);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    const splitByWhere = [...new Set( Array.from(nonCons, n => n.where ) ) ];
    
    const splitOut = splitByWhere.map( (where, index)=> {
      let match = nonCons.filter( y => y.where === where );
      return{
        'where': where,
        'pNC': match
      };
    });
      
    isDebug && console.log(splitOut);
      
    let ncCounts = [];
    let nice_typeSet = new Set();
    let nice_whereSet = new Set();
    
    for(let ncSet of splitOut) {
      for(let ncType of nonConOptions) {
        const typeCount = countMulti( ncSet.pNC.filter( x => x.type === ncType ) );
        if(typeCount > 0) {
          const nicetype = toCap(ncType, true);
          nice_typeSet.add(nicetype);
          const nicewhere = toCap(ncSet.where, true);
          nice_whereSet.add(nicewhere);
          ncCounts.push({
            x: nicewhere,
            y: nicetype,
            r: typeCount
          });
        }
      }
    }
    
    wheresSet([...nice_whereSet]);
    typesSet([...nice_typeSet]);
    seriesSet(ncCounts);
    
  }, []);
  
  const options = {
    responsive: true,
    elements: {
      point: {
        backgroundColor: 'rgba(231,76,60,0.6)',
        borderColor: 'rgb(231,76,60)',
        pointHitRadius: 10
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: wheres,
        offset: true,
        // ticks: {
        //   callback: function(v) { 
        //     return toCap( this.getLabelForValue(v) || "" ); 
        //   }
        // }
      },
      y: {
        type: 'category',
        labels: types,
        offset: true,
        // ticks: {
        //   callback: function(v) { 
        //     return toCap( this.getLabelForValue(v) || "" );
        //   }
        // }
      }
    },
    plugins: {
      title: {
        display: false
      },
      legend: false,
      tooltip: {
        callbacks: {
          label: (cntxt)=> `${cntxt.raw.x}, ${cntxt.raw.y}, Qty: ${cntxt.raw.r}`
        }
      }
    },
  };

  isDebug && console.log({series, typeNum});
    
  return(
    <div className='chart50vContain centre space'>
      <Bubble options={options} data={{datasets:[{data:series,normalized: true}]}} />
      <p className='centreText small cap'>Defect Type and Recorded Location as Bubbles</p>
    </div>
  );
};

export default NonConBubble;