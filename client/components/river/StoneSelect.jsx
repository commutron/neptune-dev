import React from 'react';
import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
import FoldInNested from './FoldInNested.jsx';
import TestFails from './TestFails.jsx';
import NCTributary from './NCTributary.jsx';
import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';
import UndoFinish from '/client/components/forms/UndoFinish.jsx';

const StoneSelect = ({ 
  id, 
  bComplete,
  flow,
  isAlt,
  hasAlt,
  rmas,
  allItems,
  nonCons,
  shortfalls,
  serial,
  history,
  finishedAt,
  subItems,
  //regRun,
  users,
  progCounts,
  app
})=> {
  
  const allTrackOption = app.trackOption;
    
  const nc = nonCons.filter( 
              x => x.serial === serial && x.inspect === false )
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
  
  const sh = shortfalls.filter( x => x.serial === serial )
              .sort((s1, s2)=> {
                if (s1.partNum < s2.partNum) { return -1 }
                if (s1.partNum > s2.partNum) { return 1 }
                return 0;
              });
  const allAnswered = sh.every( x => x.inEffect === true || x.reSolve === true );
  const sFall = <Shortfalls
          			  id={id}
          			  shortfalls={sh}
          			  lock={finishedAt !== false} />;
  
  for(let flowStep of flow) {
    const coreStep = allTrackOption.find( t => t.key === flowStep.key);
    const stepPhase = !coreStep || !coreStep.phase ? flowStep.step : coreStep.phase;

    const first = flowStep.type === 'first';

    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || fDone.includes('first' + flowStep.step)
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const ncFromHere = ncOutstanding.filter( x => x.where === stepPhase );
    const ncResolved = ncFromHere.length === 0;
    //console.log(stepMatch, ncResolved);
    
    const damStep = flowStep.type === 'test' || flowStep.type === 'finish';
  
    const ncAllClear = ncOutstanding.length === 0;
    const shAllClear = sh.length === 0 || allAnswered === true;


    if( ( ( flowStep.type === 'first' || flowStep.type === 'build' ) && stepComplete ) 
        || ( stepComplete && ncResolved ) ) {
      null;
    }else{

      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && (!ncAllClear || !shAllClear );
      const doneStone = stepComplete;
      
	    const stone = <Stone
        		          key={flowStep.key}
                      id={id}
                      barcode={serial}
                      sKey={flowStep.key}
                      step={flowStep.step}
                      type={flowStep.type}
                      allItems={allItems}
                      isAlt={isAlt}
                      hasAlt={hasAlt}
                      users={users}
                      methods={app.toolOption}
                      progCounts={progCounts}
                      blockStone={blockStone}
                      doneStone={doneStone}
                      compEntry={compEntry} />;

      const nested = <FoldInNested
                      id={id}
                      serial={serial}
                      sKey={flowStep.key}
                      step={flowStep.step}
                      doneStone={doneStone}
                      subItems={subItems}
                      lock={false} />;
      
      const nonCon = <NCTributary
              			  id={id}
              			  serial={serial}
              			  nonCons={nc}
              			  sType={flowStep.type} />;
                      
      const tFail = <TestFails fails={fTest} />;
	    
	    Session.set('ncWhere', stepPhase);
	    Session.set('nowStepKey', flowStep.key);
      Session.set('nowWanchor', flowStep.how);
	    return (
        <div>
          <div>
		        <InOutWrap type='stoneTrans'>
  		        {flowStep.type === 'nest' ?
  		          nested : stone}
            </InOutWrap>
            {fTest.length > 0 && 
              <InOutWrap type='stoneTrans'>
                {tFail}
              </InOutWrap>}
          </div>
          <div>
            {nonCon}
            {sFall}
          </div>
  			</div>
      );
    }
  }
  
  // end of flow
  Session.set('ncWhere', 'done');
  Session.set('nowStepKey', 'd0n3');
  Session.set('nowWanchor', '');
  const timelock = moment().diff(moment(finishedAt), 'minutes') > (60 * 24 * 7);
  return (
    <div>
      <div>
        <InOutWrap type='stoneTrans'>
          <div>
            <div className='purpleBorder centre cap'>
              <h2>{Pref.trackLast}ed</h2>
              <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
                {bComplete === false ?
                  <span className='space centre'>
                    {timelock && <p><i className='fas fa-lock fa-fw fa-lg'></i></p>}
                    <UndoFinish
                	    id={id}
                	    serial={serial}
                	    finishedAt={finishedAt}
                	    timelock={timelock}
                	    noText={false} />
              	  </span>
                : <p><i className='fas fa-lock fa-fw fa-lg'></i></p>}
            </div>
          </div>
        </InOutWrap>
      </div>
  		<div>
        {sFall}
      </div>
      <div className='space'>
			  <MiniHistory history={history} />
			</div>
  	</div>
  );
};
  
export default StoneSelect;