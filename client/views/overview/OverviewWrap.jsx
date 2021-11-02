import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';

import Spin from '../../components/tinyUi/Spin';
import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';

import OverviewTools from './OverviewTools';
import BatchHeaders from './columns/BatchHeaders';
import BatchDetails from './columns/BatchDetails';


const OverviewWrap = ({ 
  bx, traceDT,
  user, app, brancheS,
  isDebug
})=> {
  
  const sessionSticky = 'overviewOverview';
  
  const [ loadTime, loadTimeSet ] = useState( moment() );
  
  const sessionFilter = Session.get(sessionSticky+'filter');
  
  const defaultFilter = sessionFilter !== undefined ? sessionFilter :
                        user.defaultOverview || false;
  
  const sessionGhost = Session.get(sessionSticky+'ghost');
  const defaultGhost = sessionGhost !== undefined ? sessionGhost : false;
                        
  const sessionDense = Session.get(sessionSticky+'dense');
  const defaultDense = sessionDense !== undefined ? sessionDense :
                        user.miniAction || false;
                        
  const sessionLight = Session.get(sessionSticky+'lightTheme');
  const defaultLight =  sessionLight !== undefined ? sessionLight :
                        user.preferLight || false;
                        
  const [ filterBy, filterBySet ] = useState( defaultFilter );
  
  const [ focusBy, focusBySet ] = useState( Session.get(sessionSticky+'focus') || false );
  const [ salesBy, salesBySet ] = useState( Session.get(sessionSticky+'sales') || false );
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  
  const [ ghost, ghostSet ] = useState( defaultGhost );
  const [ dense, denseSet ] = useState( defaultDense );
  const [ light, themeSet ] = useState( defaultLight );
  const [ stormy, stormySet ] = useState(false);
  
  const [ liveState, liveSet ] = useState( false );
  
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
  
  function changeFilter(e) {
    const value = e.target.value;
    const filter = value === 'false' ? false : value;
    filterBySet( filter );
    Session.set(sessionSticky+'filter', filter);
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
  
  function changeGhost(val) {
    ghostSet( val );
    Session.set(sessionSticky+'ghost', val);
  }
  
  function changeDense(val) {
    denseSet( val );
    Session.set(sessionSticky+'dense', val);
  }
  
  function changeTheme(val) {
    themeSet( val );
    Session.set(sessionSticky+'lightTheme', val);
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
            if (isNaN(pB1bf)) { return 1 }
            if (isNaN(pB2bf)) { return -1 }
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
      
      liveSet( orderedBatches );
    });
  }
      
  const density = !dense ? '' : 'minifyed';
  
  return(
    <div key={0} className={`overviewContainer ${light === true ? 'lightTheme' : 'darkTheme'}`}>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='frontCenterTitle'
          >Overview<sup className='vbig monoFont'>WIP</sup>
        </div>
        <TideFollow />
      </div>
      
      <OverviewTools
        app={app}
        traceDT={traceDT}
        brancheS={brancheS}
        loadTimeUP={loadTime}
        focusByUP={focusBy}
        changeFocusByUP={(e)=>changeFocus(e)}
        filterByUP={filterBy}
        sortByUP={sortBy}
        salesByUP={salesBy}
        ghostUP={ghost}
        denseUP={dense}
        lightUP={light}
        stormy={stormy}
        changeFilterUP={(e)=>changeFilter(e)}
        changeSortUP={(e)=>changeSort(e)}
        changeSalesUP={(e)=>changeSales(e)}
        ghostSetUP={(e)=>changeGhost(e)}
        denseSetUP={(e)=>changeDense(e)}
        themeSetUP={(e)=>changeTheme(e)}
        stormySet={stormySet}
        doThing={()=>updateTriggerSet(!updateTrigger)}
      />
      
      <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
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
            traceDT={traceDT}
            app={app}
            isDebug={isDebug}
            title={!filterBy ? 'All Live' : filterBy}
            focusBy={focusBy}
            stormy={stormy}
          />
          
          <BatchDetails
            key='fancylist1'
            oB={liveState}
            traceDT={traceDT}
            user={user}
            app={app}
            brancheS={brancheS}
            isDebug={isDebug}
            dense={dense}
            filterBy={filterBy}
            focusBy={focusBy}
            stormy={stormy}
            branchArea={filterBy !== false}
            updateTrigger={updateTrigger}
          />
            
        </div>
      }  
      </div>
    </div>
  );
};

export default OverviewWrap;