import React from 'react';

const WikiFrame = ({ go, full })=> {
  let sty = {
    width: '100%',
    border: '0',
    margin: '0',
    padding: '0'
  };
  let correct = full ? 45 : 115;
  return (
    <iframe
      id='instruct'
      style={sty}
      src={go}
      height={( (document.body.scrollHeight - document.body.scrollTop) - correct ) +'px'}
      allowFullScreen
    />
  );
};

export default WikiFrame;