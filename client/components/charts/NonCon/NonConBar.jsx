import React, { useState, useEffect } from "react";
import { countMulti } from '/client/utility/Arrays';
import { toCap } from '/client/utility/Convert.js';
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

const NonConBar = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ types, typeNumSet ] = useState([]);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    function ncCounter(ncArray, ncOptions, splitBy) {
    
      const splitOut = splitBy.map( (where, index)=> {
        let match = ncArray.filter( y => y.where === where );
        return{
          'where': where,
          'pNC': match,
          'index': index
        };
      });
      
      isDebug && console.log(splitOut);

      let ncCounts = [];
      let typeSet = new Set();
      for(let ncSet of splitOut) {
        let ncWhere = [];
        for(let ncType of ncOptions) {
          const typeCount = countMulti( ncSet.pNC.filter( x => x.type === ncType ) || [] );
          if(typeCount > 0) {
            typeSet.add(ncType);
            ncWhere.push({
              x: typeCount,
              y: ncType,
              l: ncSet.where
            });
          }
        }
        const clrshift = "hwb(7.16deg 14.74% " + (ncSet.index*10) + "%)";
        ncCounts.push({
          label: ncSet.where,
          data: ncWhere,
          backgroundColor: clrshift,
          stack: 'stk'
        });
      }
      typeNumSet([...typeSet]);
      return ncCounts;
    }
    
    try{
      const splitByWhere = [...new Set( Array.from(nonCons, n => n.where ) ) ];
      let calc = ncCounter(nonCons, nonConOptions, splitByWhere);
      seriesSet( calc );
    }catch(err) {
      console.log(err);
    }
  }, []);
  
  return(
    <NonConBarCH
      series={series}
      types={types}
      title='Defect Type and recorded location as Bars'
      isDebug={isDebug}
    />
  );
};

export default NonConBar;

export const NonConBarCH = ({ series, types, title, isDebug })=> {

  const options = {
    indexAxis: 'y',
    responsive: true,
    elements: {
      bar: {
        maxBarThickness: 5,
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
        labels: types,
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
          label: (cntxt)=> `${toCap(cntxt.raw.l)} = ${cntxt.raw.x}`
        }
      },
      title: false,
    },
  };
  
  isDebug && console.log(series);
  
  return(
    <div className='chartNoHeightContain space'>
      {types ?
        <Bar options={options} data={{datasets:series}} />
        :
        <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1>
      }
      
      <p className='centreText small cap'>{title}</p>
      
    </div>
  );
};