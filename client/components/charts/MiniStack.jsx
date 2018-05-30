import React from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

const MiniStack = ({ title, count, countNew, total })=> {
  
  const v = count;
  const vX = countNew;
  
  const dataArr = [ [v - vX], [vX], [total - v] ];
  
  let name = {
    fontSize: '15px',
    letterSpacing: '1.5px'
  };
  let num = {
    textAlign: 'right',
    fontSize: '15px',
    letterSpacing: '1.5px'
  };
  
  let data = {
    series: dataArr,
  };
    
  let options = {
    height: 12,
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
    <div className='wide miniStack meterprogStack'>
      <p style={name} className='cap'>{title}</p>
      <ChartistGraph data={data} options={options} type={'Bar'} />
      <p style={num}>{v}/{total}</p>
    </div>
  );
};

export default MiniStack;
     