import React, { useState, Fragment } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';

import TideControl from '/client/components/tide/TideControl/TideControl';
import TideSwitch from '/client/components/tide/TideControl/TideSwitch';

import CompleteRest from './CompleteRest.jsx';
import MiniHistory from './MiniHistory.jsx';
  
const TideWall = ({ 
  bID, bComplete, bOpen, //bCascade, iCascade
  itemData, seriesData, shortfallS, scrap,
  ancOptionS, plainBrancheS,
  tideKey, tideFloodGate
})=> {
  
  const [ taskState, taskSet ] = useState( tideFloodGate ? tideFloodGate.task : false );
  const [ lockTaskState, lockTaskSet ] = useState(false);
  
  const ctxLabel = tideFloodGate ? 'Set Different Task' : `Set A Task`;
  
  return(
    <div className='vgap'>

  		{( !itemData && bOpen ) ||
  		  ( itemData && itemData.completed === false ) ? 
  		  
		    <Fragment>
          <n-big-tide-container>
            <TideControl 
              batchID={bID} 
              tideKey={tideKey}
              tideFloodGate={false}
              tideLockOut={false}
              taskState={taskState}
              lockTaskSet={lockTaskSet} />
          </n-big-tide-container>
          <BigTideTask
            ctxLabel={ctxLabel}
            ancOptionS={ancOptionS}
            plainBrancheS={plainBrancheS} 
            taskState={taskState}
            lockTaskState={lockTaskState}
            taskSet={taskSet} /> 
        </Fragment>
        
        : null }
        
        {itemData ?
          itemData.completed ?
            <CompleteRest
              seriesId={seriesData._id}
              serial={itemData.serial}
              iComplete={itemData.completed}
              history={itemData.history}
              // iCascade={iCascade}
              scrap={scrap}
              bComplete={bComplete}
              shortfallS={shortfallS} />
          :
            <MiniHistory history={itemData.history} />
        : null
        }
        
  	</div>
  );
};

export default TideWall;

export const TideBump = ({ 
  bID, bOpen,
  ancOptionS, plainBrancheS,
  tideKey, tideFloodGate
})=> {
  
  const [ taskState, taskSet ] = useState( tideFloodGate ? tideFloodGate.task : false );
  const [ lockTaskState, lockTaskSet ] = useState(false);
  
  if(bOpen) {
    return(
      <Fragment>
        <n-med-tide-container>
          <TideSwitch 
            batchID={bID} 
            tideKey={tideKey}
            tideFloodGate={false}
            tideLockOut={false}
            taskState={taskState}
            lockTaskSet={lockTaskSet} />
        </n-med-tide-container>
        <BigTideTask
          ancOptionS={ancOptionS}
          plainBrancheS={plainBrancheS} 
          taskState={taskState}
          lockTaskState={lockTaskState}
          taskSet={taskSet} />
      </Fragment>
    );
  }
  return null;
};


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