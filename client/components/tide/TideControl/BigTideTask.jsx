import React, { useEffect, Fragment } from 'react';
// import Pref from '/client/global/pref.js';

const BigTideTask = ({ 
  id, ctxLabel, brancheS,
  taskState, subtState, lockTaskState, taskSet, subtSet
})=> {
  
  const subop = taskState && brancheS.find( b=> b.branch === taskState );
  
  useEffect( ()=> {
    if(!subop?.subTasks?.length) {
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
      {ctxLabel && <label htmlFor='tskSlct'>{ctxLabel}</label>}
      <select
        id='tskSlct'
        className={`cap ${!taskState ? 'darkgrayT em' : ''}`}
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState}
        required>
        <option value={false} className='darkgrayT em'>Required</option>
        <optgroup label='Production' className='blackT nsty'>
          {brancheS.filter(n=>n.pro).map( (v, ix)=>(
            <option key={ix+'o2'} className='blackT nsty' value={v.branch}
            >{v.branch}</option>
          ))}
        </optgroup>
        <optgroup label='Supportive' className='blackT nsty'>
          {brancheS.filter(n=>!n.pro).map( (v, ix)=>(
            <option key={ix+'o2'} className='blackT nsty' value={v.branch}
            >{v.branch}</option>
          ))}
        </optgroup>
      </select>
      {subop?.subTasks?.length ?
        <Fragment>
        <label htmlFor='sbtskSlct'>Sub-Task</label>
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
        </Fragment>
      : null}
    </n-tide-task>
  );
};

export default BigTideTask;