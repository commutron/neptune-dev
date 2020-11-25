import React from 'react';

  const sty = {
    display: 'inline-block',
    textAlign: 'center',
    margin: '5px',
    width: '105px'
  };
  const bSty = {
    fontSize: '2em',
    verticalAlign: 'bottom',
  };
  
  const sSty = {
    fontSize: '1em',
    verticalAlign: 'top',
    textTransform: 'capitalize',
    fontVariant: 'small-caps',
    wordWrap: 'keep-all'
  };
 
const NumBox = ({ num, name, title, color }) => (
  <div title={title} style={sty}>
    <i style={bSty} className={color + ' numFont'}>{num}</i>
    <br />
    <i style={sSty}>{name}</i>
  </div>
);

export default NumBox;