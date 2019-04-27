import React from 'react';

  const sty = {
    display: 'inline-block',
    textAlign: 'center',
    margin: '5px',
    width: '105px'
  };
  
  const sSty = {
    fontSize: 'smaller',
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all'
  };
 
const BinaryStat = ({ good, name, title, size }) => {
  if(good == true) {
    return(
      <div style={sty} title={title}>
        <i className={"far fa-check-square greenT " + size}></i>
        <br />
        <i style={sSty}>{name}</i>
      </div>
    );
  }else{
    return(
      <div style={sty} title={title}>
        <i className={"far fa-times-circle yellowT " + size}></i>
        <br />
        <i style={sSty}>{name}</i>
      </div>
    );
  }
};

export default BinaryStat;