import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ProgCircle from '../charts/ProgCircle.jsx';

// requires batchData

export default class StepsProgress extends Component	{

  render() {

    const b = this.props.batchData;
    const flow = this.props.flow;
    const qu = b.items.length;
    
    const done = b.items.filter(x => x.finishedAt !== false).length;
    
    let steps = flow ? flow.flow.length * b.items.length : 0;


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
    
    /*
    const nc = b.nonCon.length;
    let ncF = nc;
    for(var n of b.nonCon) {
      n.inspect !== false || n.skip !== false ? ncF -= 1 : false;
    }
    */
    
    //b.finishedAt !== false ? (doneSteps = 1, steps = 1) : null;


    return (
      <div className='centre'>
      
        <ProgCircle numOne={7} />
        
        <ProgCircle numOne={3} />
        
        <ProgCircle numOne={5} />
        
      </div>
    );
  }
}