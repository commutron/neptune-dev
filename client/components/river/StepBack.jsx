import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
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
      toast.error('Rejected by Server');
    }
  });
}
        
const StepBack = ({ id, bar, entry, lock })=> (
  <button
    title="'No Good', Undo Step"
    className='miniAction'
    onClick={()=>handle(id, bar, entry)}
    disabled={lock}
  ><i className="fas fa-undo fa-lg fa-fw"></i></button>
);

export default StepBack;