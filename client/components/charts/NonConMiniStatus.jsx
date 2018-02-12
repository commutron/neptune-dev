import React from 'react';
import MiniMeter from './MiniMeter.jsx';

const NonConMiniSatus = ({ noncons, flow, flowAlt, app })=> {
  
  let dprt = new Set( Array.from(flow, x => x.step), Array.from(flowAlt, x => x.step) );
  
  let splitByStep = [];
  for(let stp of dprt) {
    let match = noncons.filter( y => y.where === stp );
    splitByStep.push({
      'name': stp,
      'ncs': match.length
    });
  }
  let leftover = noncons.filter( z => dprt.has(z.where) === false );
  leftover.length > 0 ? splitByStep.unshift({ 'name': 'before start', 'ncs': leftover.length }) : null;
  
  return(
    <div className='centre'>
      {/*<MiniMeter title='total' count={noncons.length} />*/}
      {splitByStep.map( (entry, index)=> {
        return(
          <MiniMeter key={index} title={entry.name} count={entry.ncs} app={app} />
      )})}
    </div>
  );
};

export default NonConMiniSatus;