import React from 'react';

  const sty = {
    display: 'inline-block',
    textAlign: 'center',
    margin: '5px',
    width: '105px'
  };
  const bSty = {
    verticalAlign: 'bottom',
  };
  
  const sSty = {
    fontSize: 'smaller',
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordWrap: 'keep-all'
  };
 
const NumBox = ({ num, name, title, color, size }) => (
  <div style={sty} title={title}>
    <i style={bSty} className={color + ' ' + size}>{num}</i>
    <br />
    <i style={sSty}>{name}</i>
  </div>
);

export default NumBox;