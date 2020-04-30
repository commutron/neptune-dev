import React, { useState, Fragment } from 'react';
// import moment from 'moment';
// import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';
import TideControl from '/client/components/tide/TideControl/TideControl.jsx';

import CompleteRest from './CompleteRest.jsx';
import MiniHistory from './MiniHistory.jsx';

const TideWall = ({ 
  bID, bComplete, 
  itemData, shortfallS, scrap,
  ancOptionS, plainBrancheS,
  tideKey
}) => {
  
  const [ taskState, taskSet ] = useState(false);
  
  return(
    <div className='vgap'>

  		{( !itemData && !bComplete ) || 
  		 ( itemData && itemData.finishedAt === false ) ?
  		  
  		    <Fragment>
            
            <div className='bigTideContainer'>
              <TideControl 
                batchID={bID} 
                tideKey={tideKey}
                tideFloodGate={false}
                tideLockOut={false}
                taskState={taskState} />
            </div>
            <div className='bigTideTask'>
              <select
                id='tskSlct'
                className='cap'
                onChange={(e)=>taskSet(e.target.value)}
                defaultValue={taskState}
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
              <label htmlFor='tskSlct'>Set Specific Task</label>
            </div>
            
          </Fragment>
        
        : null }
        
        
        {itemData ?
          itemData.finishedAt !== false ?
  		  
      		  <CompleteRest
              id={bID}
              bComplete={bComplete}
              sh={shortfallS}
              serial={itemData.serial}
              history={itemData.history}
              finishedAt={itemData.finishedAt}
              scrap={scrap} />
            
          :
            <MiniHistory history={itemData.history} />
        : 
          null
        }
        
  	</div>
  );
};

export default TideWall;