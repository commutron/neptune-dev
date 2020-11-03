import React, {useState, useLayoutEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
// import Pref from '/client/global/pref.js';

import Spin from '../../components/tinyUi/Spin.jsx';
import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import OverviewTools from './OverviewTools';
import BatchHeaders from './columns/BatchHeaders';
import BatchDetails from './columns/BatchDetails';


const OverviewWrap = ({ 
  b, bx, bCache, pCache, acCache, brCache, 
  user, clientTZ, app, brancheS,
  isDebug, isNightly
})=> {
  
  const sessionSticky = 'overviewOverview';
  
  const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
  
  const sessionFilter = Session.get(sessionSticky+'filter');
  // const userDefault = brancheS.find( x => x.branch === user.defaultOverview ) ?
  //                     user.defaultOverview : false; // validate default (legacy support)
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
  
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ ghost, ghostSet ] = useState( defaultGhost );
  const [ dense, denseSet ] = useState( defaultDense );
  const [ light, themeSet ] = useState( defaultLight );
  
  const [ liveState, liveSet ] = useState( false );
  
  useLayoutEffect( ()=> {
    sortInitial();
  }, [b, bx, filterBy, sortBy, ghost]);
  
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
  
  function requestRefresh() {
    workingSet( true );
    liveSet( false );
    Meteor.call('REQUESTcacheUpdate', 
      false, // batchUp
      true, // priorityUp
      true, // activityUp
      true, // branchConUp
      false, // compUp
    ()=>{
      sortInitial();
      loadTimeSet( moment() );
      workingSet( false );
    });
  }
  
  function sortInitial() {
    return new Promise((resolve) => {
      const batches = b;
      const batchesX = bx;
      
      let liveBatches = [...batches,...batchesX];
      
      let filteredBatches = filterBy === false ? 
        ghost === true ? liveBatches 
        :
        liveBatches.filter( bx => {
          const releasedToFloor = Array.isArray(bx.releases) ?
            bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
            typeof bx.floorRelease === 'object';
          if(releasedToFloor) {
            return bx;
          }
        }) 
        :
        liveBatches.filter( bbx => {
          const cB = brCache.dataSet.find( x => x.batchID === bbx._id);
          const cP = cB && cB.branchSets.find( x => x.branch === filterBy );
          const con = cP && cP.condition;
          
          isDebug && console.log(`${bbx.batch}: ${con}`);
          
          if( (con === 'onHold' && ghost === true) || (con === 'open') ) {
            return bbx;
          }
        });
      
      let orderedBatches = filteredBatches;
      
      if(sortBy === 'priority') {
        const pData = pCache.dataSet;
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          
          const pB1 = pData.find( x => x.batchID === b1._id);
          const pB1bf = pB1 ? pB1.estEnd2fillBuffer : null;
          const pB2 = pData.find( x => x.batchID === b2._id);
          const pB2bf = pB2 ? pB2.estEnd2fillBuffer : null;
          if (!pB1bf) { return 1 }
          if (!pB2bf) { return -1 }
          if (pB1.lateLate) { return -1 }
          if (pB2.lateLate) { return 1 }
          if (pB1bf < pB2bf) { return -1 }
          if (pB1bf > pB2bf) { return 1 }
          return 0;
        });
        
      }else if(sortBy === 'sales') {
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          if (b1.salesOrder < b2.salesOrder) { return -1 }
          if (b1.salesOrder > b2.salesOrder) { return 1 }
          return 0;
        });
      }else if( sortBy === 'due') {
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          let endDate1 = b1.salesEnd || b1.end;
          let endDate2 = b2.salesEnd || b2.end;
          if (endDate1 < endDate2) { return -1 }
          if (endDate1 > endDate2) { return 1 }
          return 0;
        });
      }else{
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          if (b1.batch < b2.batch) { return 1 }
          if (b1.batch > b2.batch) { return -1 }
          return 0;
        });
      }
      
      liveSet( orderedBatches );
    });
  }
      
  const density = !dense ? '' : 'minifyed';
  
  return(
    <div key={0} className={`overviewContainer ${light === true ? 'lightTheme invert' : ''}`}>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='frontCenterTitle'
          >Overview<sup className='vbig monoFont'>WIP</sup>
        </div>
        <div className='auxRight'>
          <button
            type='button'
            title='Refresh Data'
            className={working ? 'spin2 taskLink' : 'taskLink'}
            onClick={(e)=>requestRefresh()}>
          <i className='fas fa-sync-alt'></i>
          </button>
        </div>
        <TideFollow />
      </div>
      
      <OverviewTools
        app={app}
        bCache={bCache}
        brancheS={brancheS}
        loadTimeUP={loadTime}
        focusByUP={focusBy}
        changeFocusByUP={(e)=>changeFocus(e)}
        filterByUP={filterBy}
        sortByUP={sortBy}
        ghostUP={ghost}
        denseUP={dense}
        lightUP={light}
        changeFilterUP={(e)=>changeFilter(e)}
        changeSortUP={(e)=>changeSort(e)}
        ghostSetUP={(e)=>changeGhost(e)}
        denseSetUP={(e)=>changeDense(e)}
        themeSetUP={(e)=>changeTheme(e)}
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
            bCache={bCache}
            pCache={pCache}
            app={app}
            title={!filterBy ? 'All Live' : filterBy}
            focusBy={focusBy}
          />
          
          <BatchDetails
            key='fancylist1'
            oB={liveState}
            bCache={bCache}
            pCache={pCache}
            acCache={acCache}
            user={user}
            clientTZ={clientTZ}
            app={app}
            brancheS={brancheS}
            isDebug={isDebug}
            isNightly={isNightly}
            dense={dense}
            filterBy={filterBy}
            focusBy={focusBy}
            branchArea={filterBy !== false}
          />
            
        </div>
      }  
      </div>
    </div>
  );
};

export default OverviewWrap;