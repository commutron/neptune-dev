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
    let medianTry = counts[Math.floor(counts.length / 2)];
    let median = !medianTry ? groupLine : medianTry.value;//x.value > ( groupLine % 2 )  
    
    let cntr = '<span class="centre smCap"><i class="bigger blueT">' + 
                counts.length + '</i><i>' + Pref.groups + '</i></span>';
                
    let data = {
      series: counts,
      labels: Array.from(counts,
                x => { 
                  let name = x.value > median ? x.meta.toUpperCase() : ' ';
                  return name })
    };
    
    let options = {
      fullWidth: true,
      height: 325,
      startAngle: 0,
      donut: true,
      donutWidth: 40,
      showLabel: true,
      labelOffset: 40,
      labelDirection: 'explode',
      ignoreEmptyValues: true,
      chartPadding: 50,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true,
          class: 'up'
        }),
        Chartist.plugins.fillDonut({
          items: [{
            content: cntr,
            position: 'center',
            offsetY : -4,
            offsetX: 0
          }],
        }),
      ]
    };
    
  return (
    <ChartistGraph data={data} options={options} type={'Pie'} />
  );
};

export default PopGroupWIP;