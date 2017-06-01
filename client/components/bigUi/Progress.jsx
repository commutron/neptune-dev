import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// requires batchData

export default class Progress extends Component	{

  render() {

    const b = this.props.batchData;
    const flow = this.props.flow;
    const qu = b.items.length;
    
    const done = b.items.filter(x => x.finishedAt !== false).length;
    
    let steps = flow ? flow.flow.length * b.items.length : 0;
    /* not counting rma steps
    for(let cs of b.cascade) {
      steps += cs.flow.length;
    } */
    let history = 0;
    let firsts = new Set();
    for(var item of b.items) {
      for(var entry of item.history) {
        entry.accept && entry.type !== 'first' ? history += 1 : false;
        entry.type === 'first' ? firsts.add(entry.step) : false;
      }
    }
    let doneSteps = history + firsts.size;
    
    const nc = b.nonCon.length;
    let ncF = nc;
    for(var n of b.nonCon) {
      n.inspect !== false || n.skip !== false ? ncF -= 1 : false;
    }
    
    if(b.finishedAt !== false) {
      doneSteps = 1;
      steps = 1;
    }else{null}


    return (
      <div className='centre greenT big'>
      
        <b>{done}/{qu}</b>
        <progress className='proGood' value={done} max={qu}></progress>
        <progress className='proGood' value={doneSteps} max={steps}></progress>
        {this.props.detail ? <b>{doneSteps}/{steps} {Pref.buildStep}s</b> : null}
        
        {this.props.detail ? <b className='redT'>{ncF}/{nc} {Pref.nonCon}s remaining</b> : null}
        <progress className='proBad' value={ncF} max={nc}></progress>
        
      </div>
    );
  }
}