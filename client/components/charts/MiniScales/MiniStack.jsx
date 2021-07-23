import React from 'react';
import './style.css';

import { VictoryBar, VictoryStack, VictoryTooltip } from 'victory';

const MiniStack = ({ title, subtitle, count, countNew, total, truncate })=> {
  
  const v = count;
  const vX = countNew;
  let t = total === 'percent' ? 100 : total;
  
  const dataArr = [ [v - vX], [vX], [Math.max(0, t - v)] ];

  let name = {
    fontSize: '0.9rem',
    letterSpacing: '1px'
  };
  let num = {
    textAlign: 'right',
    fontSize: '0.9rem',
    letterSpacing: '1px'
  };
    
  return(
    <div 
      className={`wide miniStack meterprogStack noCopy ${t === 0 ? 'empty' : ''}`}
      title={`New: ${dataArr[1]}\nRemaining: ${dataArr[2]}`}
      >
      <p style={name} className='cap'>{title}</p>

      <VictoryStack
        colorScale={["rgb(39, 174, 96)", "rgb(46, 204, 113)", "white"]}
        horizontal={true}
        padding={0}
        height={12}
      >
        <VictoryBar 
          data={dataArr[0]}
          barRatio={5}
          labels={dataArr[0]}
          labelComponent={
            <VictoryTooltip 
              orientation='top'
              dx={-10}
              dy={10}
            />
          }
        />
        <VictoryBar
          data={dataArr[1]}
          barRatio={5}
          labels={dataArr[1]}
          labelComponent={
            <VictoryTooltip 
              orientation='top'
              dx={-10}
              dy={10}
            />
          }
        />
        <VictoryBar
          data={dataArr[2]}
          barRatio={5}
          labels={dataArr[2]}
          style={ { height: '20px' } }
          labelComponent={
            <VictoryTooltip 
              orientation='top' 
              dx={-10}
              dy={10}
              flyoutWidth={50}
              flyoutHeight={50}
            />
          }
        />
      </VictoryStack>
      
      <p style={num} className={truncate ? '' : 'comfort'}>
        {!truncate && <i className='smaller'>{subtitle}</i>}
        <n-num>{total === 'percent' ? `${v}%` : `${v}/${t}`}</n-num>
      </p>
    </div>
  );
};

export default MiniStack;