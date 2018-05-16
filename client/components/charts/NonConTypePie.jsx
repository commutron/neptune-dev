import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

const NonConTypePie = ({ ncTypes, fullWidth })=> {
  
  let total = Array.from(ncTypes, x => x.value).reduce((x,y)=> x + y);
  let ncTypesOrder = ncTypes.sort((a, b)=> { return b.value - a.value });
  
  let mean = Math.floor( total / ncTypes.length );
  
  let ncTypesNoZero = Array.from(ncTypes, x => x.value > 0 && x);
  let medianTry = ncTypesNoZero[Math.floor(ncTypesNoZero.length / 2)];
  let median = !medianTry ? mean : ( ( mean + medianTry.value ) / 2 );
  
  let cntr = '<span class="centre smCap"><i class="big redT">' + 
                total + '</i><i>Total</i></span>';
                    
  let data = {
    series: ncTypesOrder,
    labels: Array.from(ncTypesOrder, 
                        x => { 
                          let name = x.value > median ? x.meta : ' '; 
                            return name })
  };
  
  let options = {
    width: fullWidth ? '' : 600,
    fullWidth: fullWidth,
    height: 400,
    startAngle: 0,
    donut: true,
    donutWidth: 80,
    showLabel: true,
    labelOffset: 50,
    labelDirection: 'explode',
    ignoreEmptyValues: true,
    chartPadding: 70,
    plugins: [
      Chartist.plugins.tooltip({
        appendToBody: true
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

export default NonConTypePie;