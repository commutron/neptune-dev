import React, { useEffect, Fragment } from 'react';
import Pref from '/client/global/pref.js';

const BigTideTask = ({ 
  id, ctxLabel, ancOptionS, brancheS,
  taskState, subtState, lockTaskState, taskSet, subtSet
})=> {
  
  const subop = taskState && brancheS.find( b=> b.branch === taskState );
  
  useEffect( ()=> {
    if(!subop?.subTasks) {
      subtSet(undefined);
    }
  }, [taskState]);
  
  function handleTask(val) {
    const trueVal = val === 'false' ? false : val;
    taskSet(trueVal);
    subtSet(false);
  }
  function handleSubt(val) {
    const trueVal = val === 'false' ? false : val;
    subtSet(trueVal);
  }

  return(
    <n-tide-task id={id+'tidetask'}>
      <select
        id='tskSlct'
        className={`cap ${!taskState ? 'darkgrayT em' : ''}`}
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState}
        required>
        <option value={false} className='darkgrayT em'>Required</option>
        {ancOptionS.length > 0 ?
          <optgroup label='Ancillary' className='blackT nsty'>
            {ancOptionS.map( (v, ix)=>(
              <option key={ix+'o1'} className='blackT nsty' value={v}
              >{v}</option>
            ))}
          </optgroup>
        : null}
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
          className={`cap ${!subtState ? 'darkgrayT em' : ''}`}
          onChange={(e)=>handleSubt(e.target.value)}
          value={subtState}
          disabled={lockTaskState}
          required>
          <option value={false} className='darkgrayT em'>Required</option>
          {subop.subTasks.map( (v, ixs)=>(
            <option key={ixs+'o3'} className='blackT nsty' value={v}>{v}</option>
          ))}
        </select>
        <label htmlFor='sbtskSlct'>Sub-Task</label>
        </Fragment>
      : null}
    </n-tide-task>
  );
};

export default BigTideTask;