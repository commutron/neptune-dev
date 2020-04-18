import React, { useState, useEffect } from 'react';
// import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
// import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
import FirstForm from './FirstForm.jsx';
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
  rmas,
  allItems,
  nonCons,
  sh,
  item,
  currentLive,
  brancheS,
  users,
  progCounts,
  app,
  showVerify,
  optionVerify,
  changeVerify,
  undoOption,
  openUndoOption,
  closeUndoOption
})=> {
  
  const [ riverFlowState, riverFlowStateSet ] = useState( true );
  
  useEffect( ()=>{
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(riverFlowState);
  }, [riverFlowState]);
  
  
  const serial = item.serial;
  const history = item.history;
  const finishedAt = item.finishedAt;
  //const subItems = item.subItems;
  let allTrackOption = [...app.trackOption, app.lastTrack];
    
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
  
  for(let flowStep of flow) {
    const coreStep = allTrackOption.find( t => t.key === flowStep.key);
    const brKey = coreStep && coreStep.branchKey;
    const stepBranch = !brKey ? flowStep.step : 
                        brancheS.find( b => b.brKey === brKey ).branch;

    const first = flowStep.type === 'first';

    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || fDone.includes('first' + flowStep.step)
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const ncFromHere = ncOutstanding.filter( x => x.where === stepBranch );
    const ncResolved = ncFromHere.length === 0;
    //console.log(stepMatch, ncResolved);
    
    const damStep = flowStep.type === 'test' || flowStep.type === 'finish';
  
    const ncAllClear = ncOutstanding.length === 0;
    const shAllClear = sh.length === 0 || allAnswered === true;

    if( ( ( flowStep.type === 'first' || flowStep.type === 'build' ) && stepComplete ) 
        || ( stepComplete && ncResolved ) 
      ) {
      null;
    }else{

      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && (!ncAllClear || !shAllClear ) ? true : false;
      const doneStone = stepComplete || false;
	    
	    Session.set('ncWhere', stepBranch);
	    Session.set('nowStepKey', flowStep.key);
      Session.set('nowWanchor', flowStep.how);
	    return(
        <div>
          <div>
		        <InOutWrap type='stoneTrans'>
  		        {showVerify ?
                <FirstForm
                  id={id}
                  barcode={serial}
                  flowFirsts={flow.filter( x => x.type === 'first' )}
                  sKey={flowStep.type === 'first' ? flowStep.key : false}
                  step={flowStep.type === 'first' ? flowStep.step : false }
                  users={users}
                  app={app}
                  optionVerify={optionVerify}
                  changeVerify={changeVerify} />
  		        : 
    		        flowStep.type === 'nest' ?
    		          <FoldInNested
                    id={id}
                    serial={serial}
                    sKey={flowStep.key}
                    step={flowStep.step}
                    doneStone={doneStone}
                    //subItems={subItems}
                    lock={false} />
                : 
    		          <Stone
      		          key={flowStep.key}
                    id={id}
                    barcode={serial}
                    sKey={flowStep.key}
                    step={flowStep.step}
                    type={flowStep.type}
                    currentLive={currentLive}
                    allItems={allItems}
                    isAlt={isAlt}
                    hasAlt={hasAlt}
                    users={users}
                    app={app}
                    progCounts={progCounts}
                    blockStone={blockStone}
                    doneStone={doneStone}
                    compEntry={compEntry}
                    showVerify={showVerify}
                    changeVerify={changeVerify}
                    undoOption={undoOption}
                    openUndoOption={openUndoOption}
                    closeUndoOption={closeUndoOption}
                    riverFlowState={riverFlowState}
                    riverFlowStateSet={(e)=>riverFlowStateSet(e)} />
  		        }
            </InOutWrap>
            {fTest.length > 0 && 
              <InOutWrap type='stoneTrans'>
                <TestFails fails={fTest} />
              </InOutWrap>}
          </div>
          <div>
            <NCTributary
      			  id={id}
      			  serial={serial}
      			  currentLive={currentLive}
      			  nonCons={nc}
      			  sType={flowStep.type} />
            <Shortfalls
      			  id={id}
      			  shortfalls={sh}
      			  currentLive={currentLive}
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
      <InOutWrap type='stoneTrans'>
        <CompleteRest
          id={id}
          bComplete={bComplete}
          sh={sh}
          serial={serial}
          history={history}
          finishedAt={finishedAt} />
      </InOutWrap>
    );
  }
  
  return(null);
};
  
export default StoneSelect;