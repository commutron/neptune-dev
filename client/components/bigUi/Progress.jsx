import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// requires batchData

export default class Progress extends Component	{

  render() {

    const b = this.props.batchData;
    const flow = this.props.flow;
    const qu = b.items.length;
    
    const done = b.items.filter(x => x.finishedAt !== false).length;
    
    let steps = flow ? flow.length * b.items.length : 0;
    /* not counting rma steps
    for(let cs of b.cascade) {
      steps += cs.flow.length;
    } */
    let history = 0;
    let firsts = new Set();
    let scraps = 0;
    for(var item of b.items) {
      for(var entry of item.history) {
        entry.good && entry.type !== 'first' ? history += 1 : false;
        entry.type === 'first' ? firsts.add(entry.step) : false;
        entry.type === 'scrap' ? scraps += 1 : false;
      }
    }
    let doneSteps = history + firsts.size;
    
    b.finishedAt !== false ? (doneSteps = 1, steps = 1) : null;

    return (
      <div className='centre greenT big'>
      
        <b>{done}/{qu}</b>
        <progress className='proGood' value={done} max={qu}></progress>
        <progress className='proGood' value={doneSteps} max={steps}></progress>
        {this.props.detail ? <b>{doneSteps}/{steps} {Pref.buildStep}s</b> : null}
        
        {scraps > 0 ? <b className='redT'>{Pref.scrap}: {scraps}</b> : null}
        
      </div>
    );
  }
}