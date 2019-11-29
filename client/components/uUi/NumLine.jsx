import React from 'react';

  const sty = {
    display: 'block',
    padding: '0 5px',
    margin: '0 5px',
    maxWidth: '200px'
  };
  const styBig = {
    display: 'block',
    padding: '10px',
    margin: '10px 5px',
  };
  const bSty = {
    fontSize: '2em'
  };
  
  const sSty = {
    fontSize: '1em',
    textTransform: 'capitalize',
    fontVariant: 'small-caps',
    wordWrap: 'keep-all'
  };
 
const NumLine = ({ num, name, color, big }) => (
  <div style={big ? styBig : sty}>
    <i style={bSty} className={color + ' numFont'}>{num}</i>
    <i style={sSty}> {name}</i>
  </div>
);

export default NumLine;