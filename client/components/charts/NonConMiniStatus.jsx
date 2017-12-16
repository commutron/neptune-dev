import React, {Component} from 'react';
import MiniMeter from './MiniMeter.jsx';

const NonConMiniSatus = ({ noncons, app })=> {
  
  let dprt = new Set( Array.from(app.trackOption, x => x.step) );
  dprt.add(app.lastTrack.step);
  let splitByStep = [];
  for(let stp of dprt) {
    let match = noncons.filter( y => y.where === stp );
    splitByStep.push({
      'name': stp,
      'ncs': match.length
    });
  }
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