import React from 'react';
import './style.css';

import { VictoryBar, VictoryStack } from 'victory';

const MiniStack = ({ 
  title, subtitle, 
  count, countNew, countPass, total,
  tips, truncate
})=> {
  
  const v = count;
  const vX = countNew;
  const vO = countPass || 0;
  let t = total === 'percent' ? 100 : total;
  
  const dataArr = [ [vO], [v - vX], [vX], [Math.max(0, t - v - vO)] ];

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
      data-new={vX + ' New'}
      data-not={dataArr[3] + ' Remain'}
      data-by={dataArr[0][0] ? dataArr[0] + ' Bypassed' : ''}
      data-tips={tips ? tips.join(`\n`) : ''}
      >
      <p style={name} className='cap'>{title}</p>

      <VictoryStack
        colorScale={["rgb(200,200,200)", "rgb(39,174,96)", "rgb(46,204,113)", "white"]}
        horizontal={true}
        padding={0}
        height={12}
      >
        <VictoryBar 
          data={dataArr[0]}
          barRatio={5}
        />
        <VictoryBar 
          data={dataArr[1]}
          barRatio={5}
        />
        <VictoryBar
          data={dataArr[2]}
          barRatio={5}
        />
        <VictoryBar
          data={dataArr[3]}
          barRatio={5}
          style={ { height: '20px' } }
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