import React from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

const BigTideTask = ({ 
  ctxLabel, ancOptionS, plainBrancheS,
  taskState, lockTaskState, taskSet 
})=> {
  
  function handleTask(val) {
    taskSet(val);
    Session.set('userSetTask', val);
  }
  
  return(
    <n-tide-task>
      <select
        id='tskSlct'
        className='cap'
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState}
        required>
        <option value={false}></option>
        <optgroup label='Ancillary'>
          {ancOptionS.map( (v, ix)=>(
            <option key={ix+'o1'} value={v}>{v}</option>
          ))}
        </optgroup>
        <optgroup label={Pref.branches}>
          {plainBrancheS.map( (v, ix)=>(
            <option key={ix+'o2'} value={v}>{v}</option>
          ))}
        </optgroup>
      </select>
      {ctxLabel && <label htmlFor='tskSlct'>{ctxLabel}</label>}
    </n-tide-task>
  );
};

export default BigTideTask;