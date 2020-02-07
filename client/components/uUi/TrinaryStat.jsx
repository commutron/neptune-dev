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
 
const TrinaryStat = ({ status, name, title, size, onIcon, offIcon }) => {
  
  const color = status === true ? 'greenT' : 'yellowT';
  
  const iconState = status === null ?
    <i><i className={`${offIcon || 'far fa-circle'} grayT ${size}`}></i></i>
    :
    <b><i className={`${onIcon || 'fas fa-circle'} ${color} ${size}`}></i></b>;
    
  return(
    <div style={sty} title={title}>
      {iconState}
      <br />
      <i style={sSty} className='label'>{name}</i>
    </div>
  );
};

export default TrinaryStat;