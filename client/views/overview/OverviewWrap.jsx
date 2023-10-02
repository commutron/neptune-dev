import React, { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';

import Spin from '../../components/tinyUi/Spin';

import OverviewTools from './OverviewTools';
import BatchHeaders from './columns/BatchHeaders';
import BatchDetails from './columns/BatchDetails';

import { OverMenuBar } from '/client/layouts/TaskBars/TaskBars';

const OverviewWrap = ({ 
  bx, traceDT, allEquip, openMaint,
  user, app, brancheS, isDebug
})=> {
  
  const sessionSticky = 'overviewOverview';
  
  const [ loadTime, loadTimeSet ] = useState( moment() );
  
  const sessionFilter = Session.get(sessionSticky+'filter') || false;
  const defaultFilter = sessionFilter !== undefined ? sessionFilter :
                        user.defaultOverview || false;
  
  const sessionGhost = Session.get(sessionSticky+'ghost');
  const defaultGhost = sessionGhost !== undefined ? sessionGhost : false;
  
  const sessionProgs = Session.get(sessionSticky+'prog');
  const defaultProgs = sessionProgs !== undefined ? sessionProgs :
                        user.progType || false;
                        
  // const sessionDense = Session.get(sessionSticky+'dense');
  // const defaultDense = sessionDense !== undefined ? sessionDense : user.miniAction || false;
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
                        
  const [ filterBy, filterBySet ] = useState( defaultFilter );

  const [ focusBy, focusBySet ] = useState( Session.get(sessionSticky+'focus') || false );
  const [ salesBy, salesBySet ] = useState( Session.get(sessionSticky+'sales') || false );
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ tagBy, tagBySet ] = useState( Session.get(sessionSticky+'tags') || false );
  
  const [ ghost, ghostSet ] = useState( defaultGhost );
  const [ prog, progSet ] = useState( defaultProgs );
  const [ dense, denseSet ] = useState( true );
  const [ light, themeSet ] = useState( defaultLight );
  const [ stormy, stormySet ] = useState(false);
  
  const [ liveState, liveSet ] = useState( false );
  const [ holdState, holdSet ] = useState( [] );
  const [ holdShow, holdshowSet ] = useState( false );
  
  const [ serveState, serveSet ] = useState( false );
  
  useLayoutEffect( ()=> {
    sortInitial();
  }, [bx, traceDT, filterBy, salesBy, sortBy, ghost]);
  
  const [ updateTrigger, updateTriggerSet ] = useState(true);
  
  useEffect( ()=>{
    Meteor.setTimeout( ()=> {
      Meteor.call('updateLiveNoise');
    },3000);
  }, [updateTrigger]);
  
  useEffect( ()=>{
    loadTimeSet( moment() );
  }, [traceDT]);
  
  useEffect( ()=> {
    if(!filterBy) {
      serveSet(false);
    }else{
      const brKey = brancheS.find( x => x.branch === filterBy ).brKey;
    
      let serve = [];
      for(let m of openMaint) {
        const eq = allEquip.find( e => e._id === m.equipId );
        if(eq?.branchKey === brKey) {
          serve.push({
            title: m.name,
            find: 'Eq-' + eq.alias +' ~ '+ m.name,
            mId: m._id,
            equip: eq.alias,
            pass: m.status === 'notrequired',
            done: m.status === 'complete',
            due: m.close
          });
        }
      }
      serveSet(serve);
    }
  }, [openMaint, filterBy]);
  
  
  function changeBranch(val) {
    const brnch = !val || val === 'false' ? false : val;
    filterBySet( brnch );
    Session.set(sessionSticky+'filter', brnch);
  }
  
  function changeFocus(e) {
    const value = e.target.value;
    const focus = value === 'false' ? false : value;
    focusBySet( focus );
    Session.set(sessionSticky+'focus', focus);
    salesBySet( false );
    Session.set(sessionSticky+'sales', false);
  }
  
  function changeSales(e) {
    const value = e.target.value;
    const sales = value === 'false' ? false : value;
    salesBySet( sales );
    Session.set(sessionSticky+'sales', sales);
  }
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
    Session.set(sessionSticky+'sort', sort);
  }
  
  function changeTag(e) {
    const value = e.target.value;
    const tag = value === 'false' ? false : value;
    tagBySet( tag );
    Session.set(sessionSticky+'tags', tag);
  }
  
  function changeState(val, key) {
    Session.set(sessionSticky+key, val);
    switch (key) {
      case 'ghost':
        ghostSet( val );
        break;
      case 'prog':
        progSet( val );
        break;
      case 'dense':
        denseSet( val );
        break;
      case 'lightTheme':
        themeSet( val );
        break;
      default:
        null;
    }
  }
  
  function sortInitial() {
    return new Promise((resolve) => {
      let liveBatches = bx.filter( bx => bx.releases !== undefined );
      
      let filteredBatches = filterBy === false ? 
        ghost === true ? liveBatches 
        :
        liveBatches.filter( bx =>
          bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 )
        :
        liveBatches.filter( bbx => {
          const tBatch = traceDT.find( t => t.batchID === bbx._id );
          const tBc = tBatch && tBatch.branchCondition;
          const cP = tBc && tBc.find( x => x.branch === filterBy );
          const con = cP && cP.condition;
          
          isDebug && console.log(`${bbx.batch}: ${con}`);
          
          if( (con === 'onHold' && ghost === true) || (con === 'open') ) {
            return bbx;
          }
        });
        
      const limitToSales = !salesBy ? filteredBatches :
                      filteredBatches.filter( l => l.salesOrder === salesBy );
      
      const orderedBatches = 
        sortBy === 'priority' ?
          limitToSales.sort((b1, b2)=> {
            const pB1 = traceDT.find( x => x.batchID === b1._id);
            const pB1bf = pB1 ? pB1.bffrRel : null;
            const pB2 = traceDT.find( x => x.batchID === b2._id);
            const pB2bf = pB2 ? pB2.bffrRel : null;
            if (isNaN(pB1bf) || pB1.hold) { return 1 }
            if (isNaN(pB2bf) || pB2.hold) { return -1 }
            if (pB1.lateLate) { return -1 }
            if (pB2.lateLate) { return 1 }
            if (pB1bf < pB2bf) { return -1 }
            if (pB1bf > pB2bf) { return 1 }
            return 0;
          })
        :
        sortBy === 'sales' ?
          filteredBatches.sort((b1, b2)=> {
            if (b1.salesOrder < b2.salesOrder) { return -1 }
            if (b1.salesOrder > b2.salesOrder) { return 1 }
            return 0;
          })
        :
        sortBy === 'due' ?
          filteredBatches.sort((b1, b2)=> {
            let endDate1 = b1.salesEnd || b1.end;
            let endDate2 = b2.salesEnd || b2.end;
            if (endDate1 < endDate2) { return -1 }
            if (endDate1 > endDate2) { return 1 }
            return 0;
          })
        :
        filteredBatches.sort((b1, b2)=> {
          if (b1.batch < b2.batch) { return 1 }
          if (b1.batch > b2.batch) { return -1 }
          return 0;
        });
      
      
      liveSet( orderedBatches.filter( x => !x.hold ) );
      holdSet( orderedBatches.filter( x => x.hold ) );
    });
  }
      
  const density = !dense ? '' : 'minifyed';

  return(
    <Fragment>
      
      <OverviewTools
        app={app}
        traceDT={traceDT}
        brancheS={brancheS}
        loadTimeUP={loadTime}
        focusByUP={focusBy}
        changeFocusByUP={(e)=>changeFocus(e)}
        sortByUP={sortBy}
        changeSortUP={(e)=>changeSort(e)}
        salesByUP={salesBy}
        changeSalesUP={(e)=>changeSales(e)}
        tagBy={tagBy}
        changeTagsUP={(e)=>changeTag(e)} 
        ghostUP={ghost}
        ghostSetUP={(e)=>changeState(e, 'ghost')}
        progUP={prog}
        progSetUP={(e)=>changeState(e, 'prog')}
        // denseUP={dense}
        // denseSetUP={(e)=>changeState(e, 'dense')}
        lightUP={light}
        themeSetUP={(e)=>changeState(e, 'lightTheme')}
        stormy={stormy}
        stormySet={stormySet}
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
      
      <OverMenuBar 
        brancheS={brancheS}
        branchON={filterBy}
        changeBranch={(e)=>changeBranch(e)}
        light={light}
      />
        
      <div className={`overviewContent forceScrollStyle ${light === true ? 'lightTheme' : 'darkTheme'}`} tabIndex='0'>
          
        {!liveState ?
          <div className='centreContainer'>
            <div className='centrecentre'>
              <Spin />
            </div>
          </div>
        : 
          <div className={`overGridFrame ${density}`}>
      
            <BatchHeaders
              key='fancylist0'
              oB={liveState}
              hB={holdState}
              sV={serveState}
              traceDT={traceDT}
              app={app}
              isDebug={isDebug}
              title={!filterBy ? 'All Live' : filterBy}
              holdShow={holdShow}
              holdshowSet={holdshowSet}
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
            />
            
            <BatchDetails
              key='fancylist1'
              oB={liveState}
              hB={holdState}
              sV={serveState}
              traceDT={traceDT}
              user={user}
              app={app}
              brancheS={brancheS}
              isDebug={isDebug}
              holdShow={holdShow}
              holdshowSet={holdshowSet}
              prog={prog}
              dense={dense}
              filterBy={filterBy}
              focusBy={focusBy}
              tagBy={tagBy}
              stormy={stormy}
              branchArea={filterBy !== false}
              updateTrigger={updateTrigger}
            />
              
          </div>
        } 
      </div>
    </Fragment>
  );
};

export default OverviewWrap;