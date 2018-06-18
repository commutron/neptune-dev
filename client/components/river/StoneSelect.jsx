import React from 'react';
import moment from 'moment';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

import Stone from './Stone.jsx';
import StoneComplete from './StoneComplete.jsx';
import TestFails from './TestFails.jsx';
import NCTributary from './NCTributary.jsx';
import Shortfalls from './Shortfalls.jsx';
import MiniHistory from './MiniHistory.jsx';
import UndoFinish from '/client/components/forms/UndoFinish.jsx';

const StoneSelect = ({ 
  id, 
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
    
    const ncFromHere = nc.filter( x => (x.where || '') === flowStep.step.toLocaleLowerCase() );
    const hereSkipped = ncFromHere.every( x => x.skip !== false );
    
    const ncResolved = ncFromHere.length === 0 || hereSkipped === true;
    
    const damStep = flowStep.type === 'test' || flowStep.type === 'finish';
    const allSkipped = nc.every( x => x.skip !== false );
    const ncAllClear = nc.length === 0 || allSkipped === true;

    if(stepComplete && ncResolved) {
      null;
    }else{
      
      const compEntry = iDone.find( sc => sc.key === flowStep.key && sc.good === true);
      
      const fTest = flowStep.type === 'test' ? 
                    iDone.filter( x => x.type === 'test' && x.good === false) : [];
      
      /*
      let skipped = nc.every( x => x.skip !== false );
	    let block = nc.some( x => (x.where || '') !== flowStep.step ) ? true : false;
      */
      
      const stoneBlocked = <div>{flowStep.type} {flowStep.step} is Next but must clear nonCons</div>;
      
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
                      progCounts={progCounts} />;
                      
      const stoneComplete = <StoneComplete
                              id={id}
                              barcode={serial}
                              sKey={flowStep.key}
                              step={flowStep.step}
                              type={flowStep.type}
                              allItems={allItems}
                              isAlt={isAlt}
                              hasAlt={hasAlt}
                              progCounts={progCounts}
                              compEntry={compEntry} />;
      
      const showStone = stepComplete ?
                        stoneComplete :
                        damStep && !ncAllClear ?
                        stoneBlocked : 
                        stone;
      
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
      let sFall = null;
                      
      const tFail = <TestFails fails={fTest} />;
	  /*
	  if(nc.length > 0 && !skipped) {
		    
		    if(block || flowStep.type === 'finish' || flowStep.type === 'test') {
		      Session.set( 'nowStep', nc[0].where );
		      return (
		        <div className={expand && 'stonePlus'}>
  		        <div className={expand && 'ncPlus'}>
  		          {nonCon}
  		          {sFall}
  		        </div>
  		      </div>
		      );
		    }else{
		      Session.set('nowStep', flowStep.step);
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
          		  <div className='stonePlusRight space'>
          			  <MiniHistory history={history} />
          			</div>}
              <div className={expand && 'ncPlus'}>
                {nonCon}
                {sFall}
              </div>
      			</div>
		      );
		    }
	  }else if(nc.length > 0) {
	  */
		    Session.set('nowStep', flowStep.step);
        Session.set('nowWanchor', flowStep.how);
		    return (
	        <div className={expand && 'stonePlus'}>
            <div className={expand && 'stonePlusLeft'}>
  		        <InOutWrap type='stoneTrans'>
    		        {showStone}
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
	      
	    /*  
		  }else{
		    Session.set('nowStep', flowStep.step);
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
        		  <div className='stonePlusRight space'>
        			  <MiniHistory history={history} />
        			</div>}
        		<div className={expand && 'ncPlus'}>
              {sFall}
            </div>
          </div>
        );
      }
      */
    }
  }
	  
	  /*
		  if(nc.length > 0 && !skipped) {
		    
		    if(block || flowStep.type === 'finish' || flowStep.type === 'test') {
		      Session.set( 'nowStep', nc[0].where );
		      return (
		        <div className={expand && 'stonePlus'}>
  		        <div className={expand && 'ncPlus'}>
  		          {nonCon}
  		          {sFall}
  		        </div>
  		      </div>
		      );
		    }else{
		      Session.set('nowStep', flowStep.step);
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
          		  <div className='stonePlusRight space'>
          			  <MiniHistory history={history} />
          			</div>}
              <div className={expand && 'ncPlus'}>
                {nonCon}
                {sFall}
              </div>
      			</div>
		      );
		    }
		  }else if(nc.length > 0) {
		    Session.set('nowStep', flowStep.step);
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
        		  <div className='stonePlusRight space'>
        			  <MiniHistory history={history} />
        			</div>}
            <div className={expand && 'ncPlus'}>
              {nonCon}
              {sFall}
            </div>
    			</div>
	      );
		  }else{
		    Session.set('nowStep', flowStep.step);
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
        		  <div className='stonePlusRight space'>
        			  <MiniHistory history={history} />
        			</div>}
        		<div className={expand && 'ncPlus'}>
              {sFall}
            </div>
          </div>
        );
      }
    }
  }
  */
  
  // end of flow
  Session.set('nowStep', 'done');
  return (
    <div className={expand && 'stonePlus'}>
      <div className={expand && 'stonePlusLeft'}>
        <InOutWrap type='stoneTrans'>
          <div>
            <div className='purpleBorder centre cap'>
              <h2>{Pref.trackLast}ed</h2>
              <h3>{moment(iDone[iDone.length -1].time).calendar()}</h3>
                {moment(finishedAt).isSame(moment(), 'hour') &&
                  <span className='space'>
                  <UndoFinish
              	    id={id}
              	    serial={serial}
              	    finishedAt={finishedAt}
              	    noText={false} />
              	  </span>}
            </div>
          </div>
        </InOutWrap>
      </div>
      {expand &&
  		  <div className='stonePlusRight space'>
  			  <MiniHistory history={history} />
  			</div>}
  		<div className={expand && 'ncPlus'}>
        {/*sFall*/}
      </div>
  	</div>
  );
};
  
export default StoneSelect;