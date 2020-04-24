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
 
const TrinaryStat = ({ status, name, title, size, onIcon, midIcon, offIcon }) => {
  
  const iconState = status === null ?
    <em><i className={`${offIcon || 'far fa-circle grayT'} fade ${size}`}></i></em>
    : status === false ?
    <b><i className={`${midIcon || 'fas fa-circle yellowT'} ${size}`}></i></b>
    :
    <i><i className={`${onIcon || 'fas fa-circle greenT'} ${size}`}></i></i>;
    
  return(
    <div style={sty} title={title}>
      {iconState}
      <br />
      <i style={sSty} className='label'>{name}</i>
    </div>
  );
};

export default TrinaryStat;