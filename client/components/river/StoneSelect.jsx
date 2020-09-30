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
  id, 
  bComplete,
  flow,
  isAlt,
  hasAlt,
  allItems,
  nonCons,
  sh,
  iCascade,
  scrapCheck,
  item,
  brancheS,
  users,
  progCounts,
  app,
  
  showVerifyState,
  optionVerify,
  handleVerify,
  
  undoOption,
  openUndoOption,
  closeUndoOption
})=> {
  
  const [ riverFlowState, riverFlowStateSet ] = useState( true );
  
  useEffect( ()=>{
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(`rvrfl:${riverFlowState}`);
  }, [riverFlowState]);
  
  const serial = item.serial;
  const history = item.history;
  const finishedAt = item.finishedAt;
  
  useEffect( ()=> {
    Session.set('ncWhere', null);
	  Session.set('nowStepKey', null);
    Session.set('nowWanchor', null);
		riverFlowStateSet( true );
		closeUndoOption();
	}, [ serial ]);
	
  const nc = nonCons.filter( 
              x => x.serial === serial && !x.trash && x.inspect === false )
                .sort((n1, n2)=> {
                  if (n1.ref < n2.ref) { return -1 }
                  if (n1.ref > n2.ref) { return 1 }
                  return 0;
                });
  const ncOutstanding = nc.filter( x => x.skip === false );
  
  const iDone = history;
                                   
  const fDone = [];
  for(let item of allItems) {
    let firsts = item.history.filter( 
      x => x.type === 'first' && x.good !== false );
    firsts.forEach( x => fDone.push( 'first' + x.step ) );
  }
  
  const allAnswered = sh.every( x => x.inEffect === true || x.reSolve === true );
  
  
  function handleStepUndo() {
		Meteor.call('popHistory', id, serial, ()=>{
			closeUndoOption();
		});
	}
	
	
  for(let flowStep of flow) {
    const brKey = flowStep && flowStep.branchKey;
    const branchObj = brancheS.find( b => b.brKey === brKey ) || null;
    const stepBranch = branchObj ? branchObj.branch : flowStep.step;
    
    const first = flowStep.type === 'first';

    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || fDone.includes('first' + flowStep.step)
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const ncFromHere = ncOutstanding.filter( x => x.where === stepBranch );
    const ncResolved = ncFromHere.length === 0;
    
    const damStep = !branchObj ? null : branchObj.reqProblemDam;
  
    const ncAllClear = ncOutstanding.length === 0;
    const shAllClear = sh.length === 0 || allAnswered === true;
      
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
              id={id}
              serial={serial}
              sKey={flowStep.key}
              step={flowStep.step}
              doneStone={doneStone}
              //subItems={subItems}
              lock={false} />
          : 
	          <StoneControl
		          key={flowStep.key + serial}
              id={id}
              serial={serial}
              sKey={flowStep.key}
              step={flowStep.step}
              type={flowStep.type}
              branchObj={branchObj}
              allItems={allItems}
              isAlt={isAlt}
              hasAlt={hasAlt}
              users={users}
              app={app}
              progCounts={progCounts}
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
      			  id={id}
      			  serial={serial}
      			  nonCons={nc}
      			  sType={flowStep.type} />
            <Shortfalls
      			  id={id}
      			  shortfalls={sh}
      			  lock={finishedAt !== false} />
          </div>
  			</div>
      );
    }
  }
  
  Session.set('ncWhere', 'isC0mpl3t3d');
	Session.set('nowStepKey', 'c0mp13t3');
  Session.set('nowWanchor', '');
  // Complete
  if(finishedAt !== false) {
    return(
      <CompleteRest
        id={id}
        bComplete={bComplete}
        sh={sh}
        serial={serial}
        history={history}
        finishedAt={finishedAt}
        iCascade={iCascade}
        scrap={scrapCheck} />
    );
  }
  
  return(null);
};
  
export default StoneSelect;