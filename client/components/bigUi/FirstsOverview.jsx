import React from 'react';

import NumLine from '/client/components/uUi/NumLine.jsx';

const FirstsOverview = ({ doneFirsts, flow, flowAlt })=> {
  let steps = new Set();
// find the steps
  if(flow) {
    for(let s of flow) {
      if(s.type === 'first') {
        let done = doneFirsts.filter( x => x.fKey === s.key);
        steps.add( { step: s.step, count: done.length } );
      }else{null}
    }
  }else{null}
  if(flowAlt) {
    for(let as of flowAlt) {
      if(as.type === 'first') {
        let done = doneFirsts.filter( x => x.fKey === as.key);
        steps.add( { step: as.step, count: done.length } );
      }else{null}
    }
  }else{null}
// minify
  let niceSteps = [...steps].filter( ( v, indx, slf ) => slf.findIndex( x => x.step === v.step ) === indx);
  return(
    <span>
      <i>Process Firsts</i>
      {niceSteps.map( (entry, index)=>{
        return(
          <NumLine
            key={index}
            num={entry.count}
            name={entry.step}
            color='greenT' />
      )})}
    </span>
  );
};

export default FirstsOverview;