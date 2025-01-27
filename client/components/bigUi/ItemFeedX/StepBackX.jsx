import React from 'react';

const StepBackX = ({ seriesId, bar, entry, label, lock })=> {
  
  function handleBack() {
    const eKey = entry.key;
    const time = entry.time;
    Meteor.call('pullHistoryX', seriesId, bar, eKey, time, (error)=> {
      error && console.log(error);
    });
  }
  
  if(entry.type === 'finish') {
    return null;
  }
  return(
    <button
      title="'No Good', Undo Step"
      className='miniAction'
      onClick={(e)=>handleBack(e)}
      disabled={lock}
    >{label || null}<i className="fas fa-undo fa-lg fa-fw"></i></button>
  );
};

export default StepBackX;

export const PullNested = ({ seriesId, serial, nestedSerial, entry, lock })=> {
  
  function handleBack() {
    const eKey = entry.key;
    const time = entry.time;
    Meteor.call('pullNestedX', seriesId, serial, nestedSerial, eKey, time,
    (error)=> {
      error && console.log(error);
    });
  }

  return(
    <button
      title="'No Good', Remove Nested Item"
      className='miniAction'
      onClick={(e)=>handleBack(e)}
      disabled={lock}
    ><i className="fas fa-object-ungroup fa-lg fa-fw"></i></button>
  );
};