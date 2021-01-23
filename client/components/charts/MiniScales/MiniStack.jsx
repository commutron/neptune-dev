import React from 'react';
import './style.css';

import { VictoryBar, VictoryStack, VictoryTooltip } from 'victory';
//import Pref from '/client/global/pref.js';

const MiniStack = ({ title, count, countNew, total })=> {
  
  const v = count;
  const vX = countNew;
  
  const dataArr = [ [v - vX], [vX], [total - v] ];
  
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
    <div className='wide miniScale miniStack meterprogStack'>
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
            />
          }
        />
      </VictoryStack>
      
      <p style={num} className='numFont'>{v}/{total}</p>
    </div>
  );
};

export default MiniStack;