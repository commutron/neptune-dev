import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

const NonConTypePie = ({ ncTypes })=> {

  let data = {
    series: ncTypes,
    labels: Array.from(ncTypes, 
                        x => { 
                          let name = x.value > 0 ? x.meta : ' '; 
                            return name })
  };
  
  let options = {
    width: 500,
    height: 350,
    startAngle: 0,
    showLabel: true,
    labelOffset: 75,
    labelDirection: 'explode',
    ignoreEmptyValues: true,
    chartPadding: 50,
    plugins: [
      Chartist.plugins.tooltip({
        appendToBody: true
      }),
    ]
  };

  return (
    <ChartistGraph data={data} options={options} type={'Pie'} />
  );
};

export default NonConTypePie;