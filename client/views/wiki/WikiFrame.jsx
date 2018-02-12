import React from 'react';

const WikiFrame = ({ go })=> {
  let sty = {
    width: '100%',
    border: '0',
    margin: '0',
    padding: '0',
  };
  return (
    <iframe
      id='instruct'
      style={sty}
      src={go}
      height={( (document.body.scrollHeight - document.body.scrollTop) - 125 ) +'px'}
      allowFullScreen
    />
  );
};

export default WikiFrame;