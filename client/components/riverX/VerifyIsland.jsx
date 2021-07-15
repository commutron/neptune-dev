import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
// import { toast } from 'react-toastify';
//import RoleCheck from '/client/utility/RoleCheck.js';

import FirstForm from '/client/components/riverX/FirstForm.jsx';

const VerifyIsland = ({
  batchId, seriesId, itemData, 
  flowFirsts,
  brancheS,
  app, users,
  optionVerify, handleVerify,
  
})=> {
  
  const availableSteps = itemData.history.filter( x => x.type !== 'first' && x.type !== 'nest' && x.good === true );
  
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
      const branchObj = brKey ?
              brancheS.find( b => b.brKey === brKey ) : null;
      stepBranchSet( branchObj ); 
    }
  }, [optionVerify, brancheS, selectedKeyState]);
  
  
  useEffect( ()=>{
    return ()=>handleVerify(null, false);
  }, []);
  
  
  return(
    <div className='stoneForm noCopy blue'>
    	<div className='flexRR wide'>
      	<button
      		className='action stoneFormClose'
      		onClick={()=>handleVerify(null, false)}>
      		<i className="fas fa-times fa-fw fa-2x"></i>
      	</button>
    	</div>
      	
    	{!optionVerify &&
        <div className='fakeFielset'>
          <div>
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
            </select>
            <label htmlFor='repeatStep'>Repeat {Pref.trackFirst}</label>
          </div>
          <div>
            <datalist id='commonReasons'>
              {app.repeatOption.map( (entry)=>{
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
      		    required />
            <label htmlFor='change'>Process Change</label>
          </div>
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
      
      <hr />
      <hr />
      
      {availableSteps.map( (st, index)=>(
        <p key={index}>{st.step} - {st.type}</p>
      ))}
        
    </div>
  );
};

export default VerifyIsland;