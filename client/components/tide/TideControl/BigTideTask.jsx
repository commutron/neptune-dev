import React, { useState, useEffect, Fragment } from 'react';
// import Pref from '/public/pref.js';

const BigTideTask = ({ 
  id, ctxLabel, app, brancheS,
  taskState, qtSubState, lockTaskState, taskSet, qtSubSet
})=> {
  
  const [ br, brSet ] = useState(false);
  
  const qttasks = taskState && app.qtTasks.filter( q => q.brKey === br ) || [];
  let subop = [];
  for(let qs of qttasks) {
    for(let st of qs.subTasks) {
      subop.push([qs.qtKey, st]);
    }
  }
  
  useEffect( ()=> {
    if(!subop.length) {
      qtSubSet(false);
    }else if(subop.length === 1) {
      qtSubSet(subop[0]);
    }
  }, [taskState]);
  
  function handleTask(val) {
    const trueVal = val === 'false' ? false : val;
    brSet(trueVal);
    const brName = brancheS.find( b=> b.brKey === trueVal ).branch;
    taskSet(brName);
    qtSubSet(false);
  }
  function handleSubt(val) {
    const trueVal = val === 'false' ? false : val;
    const arrayVal = trueVal ? trueVal.split(",") : false;
    qtSubSet(arrayVal);
  }

  return(
    <n-tide-task id={id+'tidetask'}>
      {ctxLabel && <label htmlFor={id+'tskSlct'}>{ctxLabel}</label>}
      <select
        id={id+'tskSlct'}
        className={`cap ${!taskState ? 'darkgrayT em' : ''}`}
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState}
        required>
        <option value={false} disabled={true} className='darkgrayT em'>Required</option>
        <optgroup label='Production' className='blackT nsty'>
          {brancheS.filter(n=>n.pro).map( (v, ix)=>(
            <option key={ix+'o2'} className='blackT nsty' value={v.brKey}
            >{v.branch}</option>
          ))}
        </optgroup>
        <optgroup label='Supportive' className='blackT nsty'>
          {brancheS.filter(n=>!n.pro).map( (v, ix)=>(
            <option key={ix+'o2'} className='blackT nsty' value={v.brKey}
            >{v.branch}</option>
          ))}
        </optgroup>
      </select>
      {subop.length ?
        <Fragment>
        <label htmlFor={id+'sbtskSlct'}>Sub-Task</label>
        <select
          id={id+'sbtskSlct'}
          className={`cap ${!qtSubState ? 'darkgrayT em' : ''}`}
          onChange={(e)=>handleSubt(e.target.value)}
          value={qtSubState}
          disabled={lockTaskState}
          required>
          {subop.length > 1 &&
            <option value={false} className='darkgrayT em'>Required</option>}
          {subop.map( (v, ixs)=>(
            <option key={ixs+'o3'} className='blackT nsty' value={v}>{v[1]}</option>
          ))}
        </select>
        </Fragment>
      : null}
    </n-tide-task>
  );
};

export default BigTideTask;