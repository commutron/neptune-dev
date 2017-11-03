import React, {Component} from 'react';

import NumBox from '/client/components/uUi/NumBox.jsx';

export default class FirstsOverview extends Component {
  
  firstSteps() {
    let firsts = this.props.doneFirsts;

    let flow = this.props.flow;
    let flowAlt = this.props.flowAlt;
    
    let steps = new Set();
    if(flow) {
      for(let s of flow) {
        if(s.type === 'first') {
          let done = firsts.filter( x => x.fKey === s.key);
          steps.add( { step: s.step, count: done.length } );
        }else{null}
      }
    }else{null}
    if(flowAlt) {
      for(let as of flowAlt) {
        if(as.type === 'first') {
          let done = firsts.filter( x => x.fKey === as.key);
          steps.add( { step: as.step, count: done.length } );
        }else{null}
      }
    }else{null}
    let niceSteps = [...steps].filter( ( v, indx, slf ) => slf.findIndex( x => x.step === v.step ) === indx);
    return niceSteps;
  }

  render() {
    
    const stepsObj = this.firstSteps();
      
    return(
      <span>
        {stepsObj.map( (entry, index)=>{
          return(
            <NumBox
              key={index}
              num={entry.count}
              name={'First ' + entry.step}
              color='greenT' />
        )})}
      </span>
    );
  }
}