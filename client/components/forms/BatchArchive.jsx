import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

// requires batchData
// requires done as number result of a done function

///////////// INCOMPLETE and NON-FUNCTIONING \\\\\\\\\\\\

export default class BatchArchive extends Component	{
  
  /*
  
  // create a year entry in StatsDB if needed.
        const year = batchNum.substring(0, 2); // asumes batch numbers start with a year #
          Meteor.call('addYear', year, (error, reply)=>{
            if(error)
              console.log(error);
            if(reply) {
              Bert.alert({
                title: 'Happy New Year',
                message: 'A new statistics entry has been created',
                type: 'amethyst',
                style: 'fixed-bottom',
                icon: 'fa-birthday-cake'
              });
            }else{
              Bert.alert(Alert.danger);
            }
          });
          
          
          
          
          
    finishOne() {
    const b = this.props.batchData; // data shortcut
    const started = b.items.length > 0;
    const doubleCheck = b.items.every( x => x.finishedAt !== false );
    
    if(started && doubleCheck) {
      Meteor.call('batchFinish', b._id, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          Bert.alert(Pref.batch + ' is finished', 'success');
          Session.set('now', b.batch);
        }else{
          Bert.alert(Pref.blocked, 'danger');
        }
      });
    }else{
      null;
    }
  }
  */

  render() {

    const b = this.props.batchData;
    const flow = this.props.flow;
    const done = this.props.done;
    const qu = b.items.length;
    
    let steps = flow ? flow.flow.length * b.items.length : 0;
    /* not counting rma steps
    for(let cs of b.cascade) {
      steps += cs.flow.length;
    } */
    let history = 0;
    for(var item of b.items) {
      for(var entry of item.history) {
        entry.accept ? history += 1 : false;
      }
    } // accepted steps is better but 
     // how to count first-offs is still a problem
    
    const nc = b.nonCon.length;
    let ncF = nc;
    for(var n of b.nonCon) {
      n.inspect !== false || n.skip !== false ? ncF -= 1 : false;
    }
    
    const started = b.items.length > 0;
    const finished = b.finishedAt !== false;
    const trigger = b.items.every( x => x.finishedAt !== false );
    
    const goFinish = started && !finished && b.active && trigger ? true : false;

    return (
      <div className='centre'>
        <i>Time flies like an arrow, fruit flies like a banana. -g.marks</i>
      </div>
    );
  }
}