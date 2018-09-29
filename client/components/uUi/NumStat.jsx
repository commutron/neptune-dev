import React from 'react';

  const sty = {
    display: 'inline-block',
    textAlign: 'center',
    margin: '5px',
    width: '105px'
  };
  const bSty = {
    verticalAlign: 'bottom',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all'
  };
  
  const sSty = {
    fontSize: 'smaller',
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all'
  };
 
const NumStat = ({ num, name, title, color, size }) => (
  <div style={sty} title={title}>
    <i style={bSty} className={color + ' numFont ' + size}>{num}</i>
    <br />
    <i style={sSty}>{name}</i>
  </div>
);

export default NumStat;