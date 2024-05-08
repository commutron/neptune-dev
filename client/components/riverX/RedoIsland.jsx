import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import FirstForm from '/client/components/riverX/FirstForm';
import RedoStep from '/client/components/riverX/RedoStep';
import OptionalStep from '/client/components/riverX/OptionalStep';

const RedoIsland = ({
  batchId, seriesId, itemData, 
  flowFirsts,
  brancheS,
  app, users,
  optionVerify, handleVerify,
})=> {
  
  const [ selectedKeyState, selectedKeySet ] = useState(false);
  
  const [ stepKeyState, stepKeySet ] = useState(false);
  const [ stepNameState, stepNameSet ] = useState(false);
  const [ stepBranchState, stepBranchSet ] = useState(false);
  
  const [ repeatOpState, repeatOpSet ] = useState(false);
  
  useEffect( ()=>{
    const stoneKey = optionVerify || selectedKeyState;
    if(stoneKey) {
      const stepObj = flowFirsts.find( x => x.key === stoneKey );
      stepKeySet( stoneKey );
      stepNameSet( stepObj.step );
      
      const brKey = stepObj.branchKey;
      const branchObj = brKey ? brancheS.find( b => b.brKey === brKey ) : null;
      stepBranchSet( branchObj ); 
    }
  }, [optionVerify, brancheS, selectedKeyState]);
  
  
  useEffect( ()=>{
    return ()=>handleVerify(null, false);
  }, []);
  
  
  return(
    <div className='stoneForm noCopy blue'>
    	<div className='wide dBotGap'>
      	<button
      		className='smallAction onblueHover medBig w100'
      		onClick={()=>handleVerify(null, false)}>
      		<i className="fa-solid fa-times fa-fw gap"></i>Cancel
      	</button>
    	</div>
    	
    	<div className='vmarginhalf centreText medBig cap'>Repeat {Pref.trackFirst}</div>
      	
    	{!optionVerify &&
        <div className='fakeFielset'>
          <label htmlFor='repeatStep'>
            <select
              id='repeatStep'
              className='cap'
              onChange={(e)=>selectedKeySet(e.target.value)}
              defaultValue={selectedKeyState}
              required>
              <option></option>
              {flowFirsts.map( (dt)=> (
                  <option key={dt.key} value={dt.key}>{dt.step}</option>
              ))}
            </select>Repeat {Pref.trackFirst}
          </label>
          <label htmlFor='change'>
            <datalist id='commonReasons'>
              {(app.repeatOption || []).map( (entry)=>{
                if(entry.live === true) {
                  return( 
                    <option key={entry.key} value={entry.reason}>{entry.reason}</option> 
              )}})}
            </datalist>
            <input
      		    type='text'
      		    id='change'
      		    list='commonReasons'
      		    onChange={(e)=>repeatOpSet(e.target.value)}
      		    defaultValue={repeatOpState || ''}
      		    required />Process Change
      		</label>
        </div> }
      
      {optionVerify || (stepKeyState && repeatOpState) ?
        <FirstForm
          batchId={batchId}
          seriesId={seriesId}
          serial={itemData.serial}
          sKey={stepKeyState}
          sStep={stepNameState}
          sBranch={stepBranchState}
          repeatOp={repeatOpState}
          handleVerify={handleVerify}
          app={app}
          users={users} /> 
      : null}
      
      {optionVerify || (stepKeyState && repeatOpState) ? null :
        <RedoStep 
          batchId={batchId}
          seriesId={seriesId}
          itemData={itemData}
          brancheS={brancheS}
          app={app}
          close={()=>handleVerify(null, false)} />
      }
      
      {optionVerify || (stepKeyState && repeatOpState) ? null :
        <OptionalStep
          batchId={batchId}
          seriesId={seriesId}
          itemData={itemData}
          brancheS={brancheS}
          app={app}
          close={()=>handleVerify(null, false)}
        />
      }
      
    </div>
  );
};

export default RedoIsland;