import React from 'react';
import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
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
  regRun,
  users,
  methods,
  progCounts,
  expand 
})=> {
    
  const nc = nonCons.filter( 
              x => x.serial === serial && x.inspect === false )
                .sort((n1, n2)=> {
                  if (n1.ref < n2.ref) { return -1 }
                  if (n1.ref > n2.ref) { return 1 }
                  return 0;
                });
 
  const iDone = history;
                                   
  const fDone = [];
  for(let item of allItems) {
    const firsts = item.history.filter( 
      x => x.type === 'first' && 
        ( x.good === true || x.good === 'fine' ) );
    firsts.forEach( x => fDone.push( 'first' + x.step ) );
  }
  
  const sh = shortfalls.filter( x => x.serial === serial )
              .sort((s1, s2)=> {
                if (s1.partNum < s2.partNum) { return -1 }
                if (s1.partNum > s2.partNum) { return 1 }
                return 0;
              });
  let sFall = null;
  
  for(let flowStep of flow) {
    const first = flowStep.type === 'first';
    const inspect = flowStep.type === 'inspect';
    
    const stepComplete = first ? 
      iDone.find(ip => ip.key === flowStep.key) || fDone.includes('first' + flowStep.step)
      :
      inspect && regRun === true ?
      iDone.find(ip => ip.key === flowStep.key && ip.good === true) ||
      iDone.find(ip => ip.step === flowStep.step && ip.type === 'first' && ip.good === true)
      // failed firsts should NOT count as inpections
      :
      iDone.find(ip => ip.key === flowStep.key && ip.good === true);
    
    const stepclean = flowStep.step.toLocaleLowerCase();
    const stepmatch = stepclean + flowStep.type;
    const stepfirst = stepclean + 'first';
    
    const ncFromInspect = nc.filter( x => (x.where || '') === stepmatch || (x.where || '') === stepfirst || (x.where || '') === stepclean );
    const ncFromElse = nc.filter( x => (x.where || '') === stepmatch );
    
    const ncFromHere = flowStep.type === 'inspect' ? ncFromInspect : ncFromElse;
    const hereSkipped = ncFromHere.every( x => x.skip !== false );
    
    const ncResolved = ncFromHere.length === 0 || hereSkipped === true;
    
    const damStep = flowStep.type === 'test' || flowStep.type === 'finish';
    const allSkipped = nc.every( x => x.skip !== false );
    const ncAllClear = nc.length === 0 || allSkipped === true;

    if( (flowStep.type === 'first' && stepComplete) || (stepComplete && ncResolved) ) {
      null;
    }else{
      
      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      const blockStone = damStep && !ncAllClear;
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
                      methods={methods}
                      progCounts={progCounts}
                      blockStone={blockStone}
                      doneStone={doneStone}
                      compEntry={compEntry} />;
      
      const nonCon = <NCTributary
              			  id={id}
              			  serial={serial}
              			  nonCons={nc}
              			  sType={flowStep.type} />;
      /*        			  
      const sFall = <Shortfalls
              			  id={id}
              			  shortfalls={sh}
              			  expand={expand} />;
      */       			  
                      
      const tFail = <TestFails fails={fTest} />;
	  
	    Session.set('nowStep', flowStep.step + flowStep.type);
      Session.set('nowWanchor', flowStep.how);
	    return (
        <div className={expand && 'stonePlus'}>
          <div className={expand && 'stonePlusLeft'}>
		        <InOutWrap type='stoneTrans'>
  		        {stone}
            </InOutWrap>
            {fTest.length > 0 && 
              <InOutWrap type='stoneTrans'>
                {tFail}
              </InOutWrap>}
          </div>
          {expand &&
      		  <div className='stonePlusRight vspace'>
      			  <MiniHistory history={history} />
      			</div>}
          <div className={expand && 'ncPlus'}>
            {nonCon}
            {sFall}
          </div>
  			</div>
      );
    }
  }
  
  // end of flow
  Session.set('nowStep', 'done');
  const timelock = moment().diff(moment(finishedAt), 'minutes') > 60;
  return (
    <div className={expand && 'stonePlus'}>
      <div className={expand && 'stonePlusLeft'}>
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
      {expand &&
  		  <div className='stonePlusRight space'>
  			  <MiniHistory history={history} />
  			</div>}
  		<div className={expand && 'ncPlus'}>
        {sFall}
      </div>
  	</div>
  );
};
  
export default StoneSelect;