import React from 'react';

const KpiStat = ({ title, icon, num, name, color, more, stOpen, core })=> {
  if(!core && more) {
    return(
      <details className='kpiStat' style={{"--kpiColor": color}} title={title || ''} open={stOpen ? true : ''}>
        <summary className='keyData numFont'>
          <div>{icon ? <n-fa0><i className={icon}></i></n-fa0> : num}</div>
          <div>{name}</div>
        </summary>
        <div className='clean noindent'>{more}</div>
      </details>
    );
  }
  
  return(
    <div className='keyData numFont blackblackT' style={{"--kpiColor": color}} title={`${title || ''}\n${name}`}>
      <div>{icon ? <n-fa0><i className={icon}></i></n-fa0> : num}</div>
      {!core && <div>{name}</div> }
    </div>
  );
};

export default KpiStat;