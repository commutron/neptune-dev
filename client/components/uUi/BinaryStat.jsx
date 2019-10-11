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
 
const BinaryStat = ({ good, name, title, size, onIcon, offIcon }) => {
  if(good == true) {
    return(
      <div style={sty} title={title}>
        <i className={`${onIcon || 'fas fa-circle'} greenT ${size}`}></i>
        <br />
        <i style={sSty} className='label'>{name}</i>
      </div>
    );
  }else{
    return(
      <div style={sty} title={title}>
        <i className={`${offIcon || 'far fa-circle'} grayT ${size}`}></i>
        <br />
        <i style={sSty} className='label'>{name}</i>
      </div>
    );
  }
};

export default BinaryStat;