import React from 'react';
import Pref from '/client/global/pref.js';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

const PopGroupWIP = ({ wip })=> {
    
    const groupSplit = Array.from(wip, x => x.group);
    const uniqueGroups = new Set(groupSplit);
    const counts = [];
    for(let g of [...uniqueGroups]) {
      let pings = groupSplit.filter( x => x === g );
      counts.push({
        meta: g, 
        value: pings.length
      });
    }
    
    const groupLine = Array.from(counts, x => x.value).reduce((x,y)=> x + y) / counts.length;
  
    let data = {
      series: counts,
      labels: Array.from(counts,
                x => { 
                  let name = x.value > ( groupLine % 2 ) ? x.meta.toUpperCase() : ' ';
                  return name })
    };
    
    let options = {
      fullWidth: true,
      height: 400,
      showLabel: true,
      labelOffset: 75,
      labelDirection: 'explode',
      ignoreEmptyValues: true,
      chartPadding: 75,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true,
          class: 'up'
        }),
      ]
    };
    
  return (
    <ChartistGraph data={data} options={options} type={'Pie'} />
  );
};

export default PopGroupWIP;