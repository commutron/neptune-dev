import React from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

const MiniStack = ({ title, count, countNew, total })=> {
  
  const v = count;
  const vX = countNew;
  
  const dataArr = [ [v - vX], [vX], [total - v] ];
  
  let name = {
    position: 'relative',
    top: '0.75rem',
  };
  let num = {
    textAlign: 'right',
    letterSpacing: '1px'
  };
  
  let data = {
    series: dataArr,
  };
    
  let options = {
    height: 5,
    fullWidth: true,
    stretch:true,
    horizontalBars: true,
    stackBars: true,
    showGridBackground: true,
    axisX: {
      offset: 0,
      low: 0,
      high: total,
      showLabel: false,
      showGrid: false,
    },
    axisY: {
      showLabel: false,
      showGrid: false,
      offset: 0
    },
    chartPadding: 0,
    plugins: [
      Chartist.plugins.tooltip({
        appendToBody: true
      })
    ]
  };
    
  return(
    <div className='wide miniStack'>
      <p style={name} className='cap'>{title}</p>
      <ChartistGraph data={data} options={options} type={'Bar'} />
      <p style={num}>{v}/{total}</p>
    </div>
  );
};

export default MiniStack;
     