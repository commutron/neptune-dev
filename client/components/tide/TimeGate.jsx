import React, { useState } from 'react';
// import Pref from '/public/pref.js';

import TimeControl from '/client/components/tide/TimeControl';
  
const TimeGate = ({ 
  timeId, timeOpen,
  type, link, project,
  engagedPro, engagedMlti,
  forceSelect,
  forceTask, forceSubTask, forceQtKey, lockOut
})=> {
  
  const taskState = forceTask || timeOpen?.task || false;
  const subtState = forceSubTask || timeOpen?.subtask || false;
  const qtSubState = forceQtKey || (timeOpen ? [timeOpen.qtKey||null, timeOpen.subtask] : false);
  
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
          qtSubState={qtSubState}
          lockTaskSet={lockTaskSet}
        />
      </n-big-tide-container>
      
      {!engagedMlti && !lockOut && forceSelect ? 
        <PresetTimeTask
          taskState={taskState}
          subtState={subtState}
        />
      : null}
    </div>
  );
};

export default TimeGate;

export const PresetTimeTask = ({ taskState, subtState })=> (
  <n-tide-task>
    <select
      id='tskPreset'
      className='cap'
      value={taskState}
      disabled={true}
      required>
      <option value={taskState} className='blackT nsty'>{taskState}</option>
    </select>
    <label htmlFor='tskSlct'>Set A Task</label>
    <select
      id='sbtskPreset'
      className='cap'
      value={subtState}
      disabled={true}
      required>
      <option value={subtState} className='blackT nsty'>{subtState}</option>
    </select>
    <label htmlFor='sbtskSlct'>Sub-Task</label>
  </n-tide-task>
);