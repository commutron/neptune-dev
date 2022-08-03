import React, { useState, Fragment } from 'react';
import Pref from '/client/global/pref.js';

import TimeControl from '/client/components/tide/TimeControl';
  
const TimeGate = ({ 
  timeId, timeOpen,
  type, link, project,
  engagedPro, engagedMlti,
  brancheS, taskOptions, subOptions,
  forceSelect,
  forceTask, forceSubTask, lockOut
})=> {
  
  const [ taskState, taskSet ] = useState( forceTask || timeOpen?.task || false );
  const [ subtState, subtSet ] = useState( forceSubTask || timeOpen?.subtask || false );
  const [ lockTaskState, lockTaskSet ] = useState(false);
  
  return(
    <div className='vgap darkTheme'>
      <n-big-tide-container>
        <TimeControl
          timeId={timeId}
          timeOpen={timeOpen}
          type={type}
          link={link}
          project={project}
          engagedPro={engagedPro}
          engagedMlti={engagedMlti}
          timeLockOut={lockOut}
          taskState={taskState}
          subtState={subtState}
          lockTaskSet={lockTaskSet}
        />
      </n-big-tide-container>
      
      {!engagedMlti && !lockOut ?
        <SmplTideTask
          brancheS={brancheS}
          lockTaskState={lockTaskState}
          forceSelect={forceSelect}
          taskState={taskState}
          taskOptions={taskOptions}
          taskSet={taskSet}
          subtState={subtState}
          subOptions={subOptions}
          subtSet={subtSet}
        />
      : null}
    </div>
  );
};

export default TimeGate;


const SmplTideTask = ({ 
  brancheS,
  taskState, taskOptions,
  subtState, subOptions,
  forceSelect,
  lockTaskState, taskSet, subtSet
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
  
  return(
    <n-tide-task>
      <select
        id='tskSlct'
        className={`cap ${!taskState ? 'darkgrayT em' : ''}`}
        onChange={(e)=>handleTask(e.target.value)}
        defaultValue={taskState}
        disabled={lockTaskState || forceSelect}
        required>
        <option value={false} className='darkgrayT em'>Required</option>
        {taskOptions?.length > 0 ? 
          <optgroup label='Ancillary' className='blackT nsty'>
            {taskOptions.map( (v, ix)=>(
              <option key={ix+'o1'} className='blackT nsty' value={v}
              >{v}</option>
            ))}
          </optgroup>
        : null}
        {brancheS &&
          <optgroup label={Pref.branches} className='blackT nsty'>
            {brancheS.map( (v, ix)=>(
              <option key={ix+'o2'} className='blackT nsty' value={v.branch}
              >{v.branch}</option>
            ))}
          </optgroup>
        }
      </select>
      <label htmlFor='tskSlct'>Set A Task</label>
      {subOptions ?
        <Fragment>
        <select
          id='sbtskSlct'
          className={`cap ${!subtState ? 'darkgrayT em' : ''}`}
          onChange={(e)=>handleSubt(e.target.value)}
          defaultValue={subtState}
          disabled={lockTaskState || forceSelect}
          required>
          <option value={false} className='darkgrayT em'>Required</option>
          {subOptions.map( (v, ixs)=>(
            <option key={ixs+'o3'} className='blackT nsty' value={v}>{v}</option>
          ))}
        </select>
        <label htmlFor='sbtskSlct'>Sub-Task</label>
        </Fragment>
      : subtSet(undefined)}
    </n-tide-task>
  );
};