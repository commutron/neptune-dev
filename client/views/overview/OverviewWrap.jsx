import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import BatchHeaders from './columns/BatchHeaders.jsx';
import BatchDetails from './columns/BatchDetails.jsx';

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const OverviewWrap = ({ b, bx, bCache, pCache, cCache, user, clientTZ, app })=> {

  const sessionSticky = 'overviewOverview';
  
  const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
  const [ tickingTime, tickingTimeSet ] = useState( moment() );
  
  const [ filterBy, filterBySet ] = useState( Session.get(sessionSticky+'filter') || false );
  const [ sortBy, sortBySet ] = useState( Session.get(sessionSticky+'sort') || 'priority' );
  const [ dense, denseSet ] = useState( Session.get(sessionSticky+'dense') || 0 );
  const [ light, themeSet ] = useState( Session.get(sessionSticky+'lightTheme') || false );
  
  const [ liveState, liveSet ] = useState( false );
  
  useEffect( ()=> {
    sortInitial();
  }, [filterBy, sortBy]);
  
  useEffect( ()=> {
    Session.set(sessionSticky+'dense', dense);
  }, [dense]);
  
  useEffect( ()=> {
    Session.set(sessionSticky+'lightTheme', light);
  }, [light]);

  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
  
  function changeFilter(e) {
    const value = e.target.value;
    const filter = value === 'false' ? false : value;
    filterBySet( filter );
    Session.set(sessionSticky+'filter', filter);
  }
  
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
    Session.set(sessionSticky+'sort', sort);
  }
  
  function requestRefresh() {
    workingSet( true );
    liveSet( false );
    Meteor.call('REQUESTcacheUpdate', clientTZ, true, true, true, false, ()=>{
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
      
      let filteredBatches = filterBy === false ? liveBatches :
        filterBy === Pref.kitting ? 
        liveBatches.filter( bx => {
          const releasedToFloor = Array.isArray(bx.releases) ?
            bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
            typeof bx.floorRelease === 'object';
          if(!releasedToFloor) {
            return bx;
          }
        }) :
        filterBy === Pref.released ? 
        liveBatches.filter( bx => {
          const releasedToFloor = Array.isArray(bx.releases) ?
            bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
            typeof bx.floorRelease === 'object';
          if(releasedToFloor) {
            return bx;
          }
        }) :
        liveBatches.filter( bx => {
          const cB = cCache.dataSet.find( x => x.batchID === bx._id);
          const cP = cB && cB.phaseSets.find( x => x.phase === filterBy );
          const con = cP && cP.condition;
          
          Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(`${bx.batch}: ${con}`);
          
          if(con && con === 'open') {
            return bx;
          }
        });
      
      let orderedBatches = filteredBatches;
      
      if(sortBy === 'priority') {
        orderedBatches = filteredBatches.sort((b1, b2)=> {
          const pB1 = pCache.dataSet.find( x => x.batchID === b1._id);
          const pB1bf = pB1 ? pB1.estEnd2fillBuffer : null;
          const pB2 = pCache.dataSet.find( x => x.batchID === b2._id);
          const pB2bf = pB2 ? pB2.estEnd2fillBuffer : null;
          
          if (!pB1bf) { return 1 }
          if (!pB2bf) { return -1 }
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
   
  const duration = moment.duration(
    loadTime.diff(tickingTime))
      .humanize();
      
  const density = dense === 1 ? 'compact' :
                  dense === 2 ? 'minifyed' :
                  '';
                  
  const isNightly = Roles.userIsInRole(Meteor.userId(), 'nightly');
    
  return(
    <div key={0} className={`overviewContainer ${light === true ? 'lightTheme invert' : ''}`}>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='frontCenterTitle'>Overview</div>
        <div className='auxRight'>
          <button
            type='button'
            title='Refresh Data'
            className={working ? 'spin2' : ''}
            onClick={(e)=>requestRefresh()}>
          <i className='fas fa-sync-alt primeRightIcon'></i>
          </button>
        </div>
        <TideFollow />
      </div>
      
      <nav className='overviewToolbar'>
        <span>
          <i className='fas fa-filter fa-fw grayT'></i>
          <select
            id='filterSelect'
            title={`Change ${Pref.phase} Filter`}
            className='overToolSort liteToolOn'
            defaultValue={filterBy}
            onChange={(e)=>changeFilter(e)}>
            <option value={false}>All</option>
            <option value={Pref.kitting} className='cap'>{Pref.kitting}</option>
            <option value={Pref.released} className='cap'>{Pref.released}</option>
            {app.phases.map( (ph, ix)=> {
              return(
                <option key={ph+ix} value={ph}>{ph}</option>
            )})}
          </select>
        </span>
        
        <span>
          <i className='fas fa-sort-amount-down fa-fw grayT'></i>
          <select
            id='sortSelect'
            title='Change List Order'
            className='overToolSort liteToolOn'
            defaultValue={sortBy}
            onChange={(e)=>changeSort(e)}>
            <option value='priority'>priority</option>
            <option value='batch'>{Pref.batch}</option>
            <option value='sales'>{Pref.salesOrder}</option>
            <option value='due'>{Pref.end}</option>
          </select>
        </span>
        
        <span>
          <button
            key='denseOff'
            title='Comfort Layout'
            onClick={()=>denseSet(0)}
            className={dense === 0 ? 'liteToolOn' : 'liteToolOff'}
          ><i className='fas fa-expand-arrows-alt fa-fw'></i></button>
          <button
            key='compactOn'
            title='Compact Layout'
            onClick={()=>denseSet(1)}
            className={dense === 1 ? 'liteToolOn' : 'liteToolOff'}
          ><i className='fas fa-compress fa-fw'></i></button>
          <button
            key='miniOn'
            title='Minifyed Layout'
            onClick={()=>denseSet(2)}
            className={dense === 2 ? 'liteToolOn' : 'liteToolOff'}
          ><i className='fas fa-compress-arrows-alt fa-fw'></i></button>
        </span>
        
        {isNightly ?
          <span>
            <button
              key='darkOn'
              title='Dark Theme'
              onClick={()=>themeSet(false)}
              className={light === false ? 'liteToolOn' : 'liteToolOff'}
            ><i className='fas fa-moon fa-fw'></i></button>
            <button
              key='lightOn'
              title='Light Theme'
              onClick={()=>themeSet(true)}
              className={light === true ? 'liteToolOn' : 'liteToolOff'}
            ><i className='fas fa-sun fa-fw'></i></button>
          </span>
        : null}
        
        <span className='flexSpace' />
        <span>Updated {duration} ago</span>
      </nav>
    
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
            title={filterBy || 'All Live'}
          />
          
          <BatchDetails
            key='fancylist1'
            oB={liveState}
            bCache={bCache}
            pCache={pCache}
            user={user}
            clientTZ={clientTZ}
            app={app}
            dense={dense > 1}
          />
            
        </div>
      }  
      </div>
    </div>
  );
};

export default OverviewWrap;