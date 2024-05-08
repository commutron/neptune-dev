import React from 'react';

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
  
  const per = (val)=> Math.max(0, Math.ceil( ( val / t ) * 100 ) );
  
  const by = per(dataArr[0]);
  const dn = by + per(dataArr[1]);
  const nw = dn + per(dataArr[2]);
  
  let bar = {
    width: '100%',
    height: '0.5rem',
    margin: '2px 0',
    backgroundImage: `linear-gradient(to right, rgb(200,200,200) 0% ${by}%, rgb(39,174,96) ${by}% ${dn}%, rgb(46,204,113) ${dn}% ${nw}%, white ${nw}% 100%`
  };
  
  return(
    <div 
      className={`wide miniStack noCopy ${t === 0 ? 'empty' : ''}`}
      data-new={vX + ' New'}
      data-not={dataArr[3] + ' Remain'}
      data-by={dataArr[0][0] ? dataArr[0] + ' Bypassed' : ''}
      data-tips={tips ? tips.join(`\n`) : ''}
      >
      <p style={name} className='cap'>{title}</p>
      
      <div style={bar}></div>
      
      <p style={num} className={truncate ? '' : 'comfort'}>
        {!truncate && <i className='smaller'>{subtitle}</i>}
        <n-num>{total === 'percent' ? `${v}%` : `${v}/${t}`}</n-num>
      </p>
    </div>
  );
};

export default MiniStack;

/* old backup
container class inc "meterprogStack"
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
*/