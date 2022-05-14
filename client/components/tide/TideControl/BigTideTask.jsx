import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

const BigTideTask = ({ 
  ctxLabel, ancOptionS, brancheS,
  taskState, subtState, lockTaskState, taskSet, subtSet
})=> {
  
  function handleTask(val) {
    const trueVal = val === 'false' ? false : val;
    taskSet(trueVal);
    subtSet(false);
    !this.sbtskSlct ? null : this.sbtskSlct.value = false;
  }
  function handleSubt(val) {
    const trueVal = val === 'false' ? false : val;
    subtSet(trueVal);
  }
  
  const subop = taskState && brancheS.find( b=> b.branch === taskState );
  
  return(
    <n-tide-task>
      <select
        id='tskSlct'
        className={`cap ${!taskState ? 'darkgrayT em' : ''}`}
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState}
        required>
        <option value={false} className='darkgrayT em'>Task Required</option>
        <optgroup label='Ancillary' className='blackT nsty'>
          {ancOptionS.map( (v, ix)=>(
            <option key={ix+'o1'} className='blackT nsty' value={v}
            >{v}</option>
          ))}
        </optgroup>
        <optgroup label={Pref.branches} className='blackT nsty'>
          {brancheS.map( (v, ix)=>(
            <option key={ix+'o2'} className='blackT nsty' value={v.branch}
            >{v.branch}</option>
          ))}
        </optgroup>
      </select>
      {ctxLabel && <label htmlFor='tskSlct'>{ctxLabel}</label>}
      {subop && subop.subTasks ?
        <Fragment>
        <select
          id='sbtskSlct'
          className='cap'
          onChange={(e)=>handleSubt(e.target.value)}
          defaultValue={subtState}
          disabled={lockTaskState}
          required>
          <option value={false}></option>
          {subop.subTasks.map( (v, ixs)=>(
            <option key={ixs+'o3'} value={v}>{v}</option>
          ))}
        </select>
        <label htmlFor='sbtskSlct'>Sub-Task</label>
        </Fragment>
      : null}
    </n-tide-task>
  );
};

export default BigTideTask;