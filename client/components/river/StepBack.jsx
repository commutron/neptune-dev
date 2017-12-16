import React from 'react';
import Pref from '/client/global/pref.js';

//// Dangerous Component, use carefully \\\\

function handle(id, bar, entry) {
  const flag = entry.key;
  const time = entry.time;
  let replace = entry;
  replace.good = false;
  Meteor.call('pullHistory', id, bar, flag, time, (error, reply)=> {
    if(error)
      console.log(error);
    if(reply) {
      Meteor.call('pushHistory', id, bar, replace, (error)=> {
        if(error)
          console.log(error);
      });
    }else{
      Bert.alert(Pref.blocked, 'danger');
    }
  });
}
        
const StepBack = ({ id, bar, entry, lock })=> (
  <button
    className='miniAction redT'
    onClick={()=>handle(id, bar, entry)}
    disabled={lock}
    readOnly={true}
  ><i className='fas fa-times'></i></button>
);

export default StepBack;