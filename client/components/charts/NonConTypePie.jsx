import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

const NonConTypePie = ({ ncTypes })=> {
  
  let total = Array.from(ncTypes, x => x.value).reduce((x,y)=> x + y);
  let cntr = '<span class="centre smCap"><i class="medBig redT">' + 
                  total + 
                    '</i><i>Total</i></span>';

  let data = {
    series: ncTypes,
    labels: Array.from(ncTypes, 
                        x => { 
                          let name = x.value > ncTypes.length % 10 ? x.meta : ' '; 
                            return name })
  };
  
  let options = {
    width: 500,
    height: 350,
    startAngle: 0,
    donut: true,
    donutWidth: 75,
    showLabel: true,
    labelOffset: 50,
    labelDirection: 'explode',
    ignoreEmptyValues: true,
    chartPadding: 50,
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