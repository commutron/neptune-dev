import React, { useState, Fragment } from 'react';

import TideControl from '/client/components/tide/TideControl/TideControl';
import TideSwitch from '/client/components/tide/TideControl/TideSwitch';
import BigTideTask from '/client/components/tide/TideControl/BigTideTask';

import CompleteRest from './CompleteRest.jsx';
import MiniHistory from './MiniHistory.jsx';
  
const TideWall = ({ 
  bID, bComplete, bOpen, rapidData,
  itemData, seriesData, shortfallS, altitle, scrap,
  app, brancheS,
  tideKey, timeOpen, engagedPro, engagedMlti
})=> {
  
  const [ taskState, taskSet ] = useState( timeOpen?.task || false );
  const [ subtState, subtSet ] = useState( timeOpen?.subtask || false );
  const [ lockTaskState, lockTaskSet ] = useState(false);
 
  const ctxLabel = timeOpen ? 'Set Different Task' : 'Set A Task';
  
  if(!bOpen && bComplete && !rapidData.rapDo ) {
    return null;
  }
  return(
    <span>

  		{bOpen &&
  		  ( !itemData ||
  		    ( itemData && 
  		      ( itemData.completed === false || rapidData.rapIs || rapidData.rapDo ) 
  		    ) 
  		  ) ? 
  		  
		    <div className='vgap'>
          <n-big-tide-container>
            <TideControl 
              batchID={bID} 
              tideKey={tideKey}
              timeOpen={timeOpen}
              tideLockOut={false}
              engagedPro={engagedPro}
              engagedMlti={engagedMlti}
              taskState={taskState}
              subtState={subtState}
              lockTaskSet={lockTaskSet} />
          </n-big-tide-container>
          {!engagedMlti &&
            <BigTideTask
              ctxLabel={ctxLabel}
              app={app}
              brancheS={brancheS} 
              taskState={taskState}
              subtState={subtState}
              lockTaskState={lockTaskState}
              taskSet={taskSet}
              subtSet={subtSet}
            />
          }
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
  brancheS,
  tideKey, timeOpen, engagedPro
})=> {
  
  const [ taskState, taskSet ] = useState( timeOpen?.task || false );
  const [ subtState, subtSet ] = useState( timeOpen?.subtask || false );
  const [ lockTaskState, lockTaskSet ] = useState( false );
  
  if(bOpen && engagedPro) {
    return(
      <Fragment>
        <n-med-tide-container>
          <TideSwitch 
            batchID={bID} 
            tideKey={tideKey}
            timeOpen={false}
            tideLockOut={false}
            taskState={taskState}
            subtState={subtState}
            lockTaskSet={lockTaskSet} />
        </n-med-tide-container>
        <BigTideTask
          ctxLabel='Set Different Task'
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