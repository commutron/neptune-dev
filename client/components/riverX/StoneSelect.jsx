import React, { useState, useEffect } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

import StoneControl from './StoneControl.jsx';

import FoldInNested from './FoldInNested.jsx';
import TestFails from './TestFails.jsx';
import NCTributary from './NCTributary.jsx';
import Shortfalls from './Shortfalls.jsx';
import CompleteRest from './CompleteRest.jsx';

const StoneSelect = ({ 
  bID, 
  bComplete,
  flow,
  rapIs, rarapid,
  seriesId,
  item,
  allItems,
  nonCons,
  shortfalls,
  // iCascade,
  scrapCheck,
  
  brancheS,
  users,
  flowCounts,
  app,
  
  showVerifyState,
  optionVerify,
  handleVerify,
  
  undoOption,
  openUndoOption,
  closeUndoOption
})=> {
  
  // const thingMounted = useRef(true);
  
  const [ riverFlowState, riverFlowStateSet ] = useState( true );
  
  // useEffect( ()=>{
  //   Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(`rvrfl:${riverFlowState}`);
  // }, [riverFlowState]);
  
  const serial = item.serial;
  
  // useEffect(() => {
  //   return () => { thingMounted.current = false; };
  // }, []);
  
  useEffect( ()=> {
    Session.set('ncWhere', null);
	  Session.set('nowStepKey', null);
    Session.set('nowWanchor', null);
		riverFlowStateSet( true );
		closeUndoOption();
	}, [ serial ]);
	
  const nc = nonCons.filter( 
              x => x.serial === serial && !x.trash && x.inspect === false )
                .sort((n1, n2)=> n1.ref < n2.ref ? -1 : n1.ref > n2.ref ? 1 : 0 );
                
  const ncOutstanding = nc.filter( x => x.snooze === false );
  
  const iDone = item.history;

  const allAnswered = shortfalls.length === 0 ||
            shortfalls.every( x => x.inEffect === true || x.reSolve === true );
  
  function handleStepUndo() {
		Meteor.call('popHistoryX', seriesId, serial, ()=>{
			closeUndoOption();
		});
	}
	
	
  for(let flowStep of flow) {
    const brKey = flowStep && flowStep.branchKey;
    const branchObj = brancheS.find( b => b.brKey === brKey ) || null;
    const stepBranch = branchObj ? branchObj.branch : flowStep.step;
    
    const first = flowStep.type === 'first';
      
    const didFirst = first && allItems.find( i => i.history.find( 
            x => x.key === flowStep.key && x.good !== false ) ) ? true : false;
  
    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || didFirst
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const ncFromHere = ncOutstanding.filter( x => x.where === stepBranch );
    const ncResolved = ncFromHere.length === 0;
    
    const damStep = !branchObj ? null : branchObj.reqProblemDam;
  
    const ncAllClear = ncOutstanding.length === 0;
    const shAllClear = allAnswered === true;
      
    if( ( ( flowStep.type === 'first' || flowStep.type === 'build' ) && stepComplete ) 
        || ( stepComplete && ncResolved ) 
      ) {
      null;
    }else{
      
      Session.set('ncWhere', stepBranch);
	    Session.set('nowStepKey', flowStep.key);
      Session.set('nowWanchor', flowStep.how);
    
      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && ( !ncAllClear || !shAllClear ) ? true : false;
      const doneStone = stepComplete || false;
	    
	    return(
        <div>

	        {flowStep.type === 'nest' ?
	          <FoldInNested
              seriesId={seriesId}
              serial={serial}
              sKey={flowStep.key}
              step={flowStep.step}
              doneStone={doneStone}
              //subItems={subItems}
              lock={false} />
          : 
	          <StoneControl
		          key={flowStep.key + serial}
              batchId={bID}
              seriesId={seriesId}
              serial={serial}
              sKey={flowStep.key}
              step={flowStep.step}
              type={flowStep.type}
              rapIs={rapIs}
              rarapid={rarapid}
              branchObj={branchObj}
              allItems={allItems}
              users={users}
              app={app}
              flowCounts={flowCounts}
              blockStone={blockStone}
              doneStone={doneStone}
              compEntry={compEntry}
              handleVerify={handleVerify}
              undoOption={undoOption}
              openUndoOption={openUndoOption}
              riverFlowState={riverFlowState}
              riverFlowStateSet={(e)=>riverFlowStateSet(e)} />
	        }
  	          
          <div className='undoStepWrap'>
  					{undoOption ? 
  						<button
  							className='textAction'
  							onClick={(e)=>handleStepUndo(e)}
  						>undo last step</button>
  					: null}
  				</div>
          
            
          {fTest.length > 0 && 
            <TestFails fails={fTest} />
          }
          
          <div>
            <NCTributary
      			  seriesId={seriesId}
      			  serial={serial}
      			  nonCons={nc}
      			  sType={flowStep.type} />
            <Shortfalls
      			  seriesId={seriesId}
      			  shortfalls={shortfalls}
      			  lock={item.completed && !rapIs} />
          </div>
  			</div>
      );
    }
  }
  
  Session.set('ncWhere', 'isC0mpl3t3d');
	Session.set('nowStepKey', 'c0mp13t3');
  Session.set('nowWanchor', '');
  // Complete
  if(item.completed) {
    return(
      <CompleteRest
        seriesId={seriesId}
        serial={item.serial}
        iComplete={item.completedAt}
        history={item.history}
        altPath={item.altPath}
        scrap={scrapCheck}
        bComplete={bComplete}
        shortfallS={shortfalls} />
    );
  }
  
  return(null);
};
  
export default StoneSelect;