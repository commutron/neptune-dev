import React, { useState, Fragment } from 'react';

import TideControl from '/client/components/tide/TideControl/TideControl';
import TideSwitch from '/client/components/tide/TideControl/TideSwitch';
import BigTideTask from '/client/components/tide/TideControl/BigTideTask';

import CompleteRest from './CompleteRest.jsx';
import MiniHistory from './MiniHistory.jsx';
  
const TideWall = ({ 
  bID, bComplete, bOpen, rapidData,
  itemData, seriesData, shortfallS, altitle, scrap,
  ancOptionS, brancheS,
  tideKey, tideFloodGate
})=> {
  
  const [ taskState, taskSet ] = useState( tideFloodGate ? tideFloodGate.task : false );
  const [ subtState, subtSet ] = useState( tideFloodGate ? tideFloodGate.subtask || false : false );
  const [ lockTaskState, lockTaskSet ] = useState(false);
 
  const ctxLabel = tideFloodGate ? 'Set Different Task' : `Set A Task`;
  
  if(!bOpen && bComplete && !rapidData.rapDo ) {
    return null;
  }
  return(
    <span>

  		{bOpen && ( ( !itemData ) ||
  		  ( itemData && ( itemData.completed === false || 
  		    rapidData.rapIs || rapidData.rapDo ) ) ) ? 
  		  
		    <div className='vgap'>
          <n-big-tide-container>
            <TideControl 
              batchID={bID} 
              tideKey={tideKey}
              tideFloodGate={false}
              tideLockOut={false}
              taskState={taskState}
              subtState={subtState}
              lockTaskSet={lockTaskSet} />
          </n-big-tide-container>
          <BigTideTask
            ctxLabel={ctxLabel}
            ancOptionS={ancOptionS}
            brancheS={brancheS} 
            taskState={taskState}
            subtState={subtState}
            lockTaskState={lockTaskState}
            taskSet={taskSet}
            subtSet={subtSet} /> 
        </div>
        
      : null }
      
      {itemData ?
        itemData.completed ?
          <CompleteRest
            seriesId={seriesData._id}
            serial={itemData.serial}
            iComplete={itemData.completedAt}
            history={itemData.history}
            iAlt={itemData.altPath}
            altitle={altitle}
            scrap={scrap}
            bComplete={bComplete}
            shortfallS={shortfallS} />
        :
          <MiniHistory 
            history={itemData.history} 
            iAlt={itemData.altPath}
            altitle={altitle} />
      : null
      }
  	</span>
  );
};

export default TideWall;

export const TideBump = ({ 
  bID, bOpen,
  ancOptionS, brancheS,
  tideKey, tideFloodGate
})=> {
  
  const ctxLabel = tideFloodGate ? 'Set Different Task' : `Set A Task`;
  
  const [ taskState, taskSet ] = useState( tideFloodGate ? tideFloodGate.task : false );
  const [ subtState, subtSet ] = useState( tideFloodGate ? tideFloodGate.subtask || false : false );
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
            subtState={subtState}
            lockTaskSet={lockTaskSet} />
        </n-med-tide-container>
        <BigTideTask
          ctxLabel={ctxLabel}
          ancOptionS={ancOptionS}
          brancheS={brancheS} 
          taskState={taskState}
          subtState={subtState}
          lockTaskState={lockTaskState}
          taskSet={taskSet}
          subtSet={subtSet} />
      </Fragment>
    );
  }
  return null;
};