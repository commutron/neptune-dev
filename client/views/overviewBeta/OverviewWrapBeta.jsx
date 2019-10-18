import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import BatchHeaders from './columns/BatchHeadersBeta.jsx';
import BatchDetails from './columns/BatchDetailsBeta.jsx';

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

  const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
  const [ tickingTime, tickingTimeSet ] = useState( moment() );
  const [ filterBy, filterBySet ] = useState('surface mount');
  const [ sortBy, sortBySet ] = useState('priority');
  const [ dense, denseSet ] = useState(0);
  const [ liveState, liveSet ] = useState(false);
  
  useEffect( ()=> {
    sortInitial();
  }, [sortBy, loadTime]);

  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
  
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
  }
  
  function forceRefresh() {
    workingSet( true );
    loadTimeSet( false );
    loadTimeSet( moment() );
    Meteor.call('FORCEcacheUpdate', clientTZ, ()=>{
      workingSet( false );
    });
  }
  
  function sortInitial() {
    return new Promise((resolve) => {
      const batches = b;
      const batchesX = bx;
      
      let liveBatches = [...batches,...batchesX];
      
      let filteredBatches = filterBy === false ? liveBatches :
        liveBatches.filter( bx => {
          const cB = cCache.dataSet.find( x => x.batchID === bx._id);
          const cP = cB && cB.phaseSets.find( x => x.phase === filterBy );
          const con = cP && cP.condition;
          
          console.log(`${bx.batch}: ${con}`);
          
          if(con) {
            return bx;
          }
          
          
          
        });
      console.log(filteredBatches);
      
      
      
      
      let orderedBatches = liveBatches;
      
      if(sortBy === 'priority') {
        orderedBatches = liveBatches.sort((b1, b2)=> {
          const pB1 = pCache.dataSet.find( x => x.batchID === b1._id);
          const pB1bf = pB1 ? pB1.estEnd2fillBuffer : null;
          const pB2 = pCache.dataSet.find( x => x.batchID === b2._id);
          const pB2bf = pB2 ? pB2.estEnd2fillBuffer : null;
          
          if (!pB1bf) { return 1 }
          if (pB1bf < pB2bf) { return -1 }
          if (pB1bf > pB2bf) { return 1 }
          return 0;
        });
        
      }else if(sortBy === 'sales') {
        orderedBatches = liveBatches.sort((b1, b2)=> {
          if (b1.salesOrder < b2.salesOrder) { return 1 }
          if (b1.salesOrder > b2.salesOrder) { return -1 }
          return 0;
        });
      }else if( sortBy === 'due') {
        orderedBatches = liveBatches.sort((b1, b2)=> {
          let endDate1 = b1.salesEnd || b1.end;
          let endDate2 = b2.salesEnd || b2.end;
          if (endDate1 < endDate2) { return -1 }
          if (endDate1 > endDate2) { return 1 }
          return 0;
        });
      }else{
        orderedBatches = liveBatches.sort((b1, b2)=> {
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
  
  if(!liveState) {
    return(
      <div className='centreContainer'>
        <div className='centrecentre'>
          <Spin />
        </div>
      </div>
    );
  }
    
  return(
    <AnimateWrap type='contentTrans'>
      <div key={0} className='overviewContainer'>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop />
        <div className='tenHeader'>
          <div className='topBorder'></div>
          <HomeIcon />
          <div className='frontCenterTitle'>Overview ~BETA~</div>
          <div className='auxRight'>
            <button
              type='button'
              title='Refresh Information'
              className={working ? 'spin2' : ''}
              onClick={(e)=>forceRefresh()}>
            <i className='fas fa-sync-alt primeRightIcon'></i>
            </button>
          </div>
          <TideFollow />
        </div>
        
        <nav className='overviewToolbar'>
          <span>
            <i className='fas fa-sort-amount-down fa-fw grayT'></i>
            <select
              id='sortSelect'
              title='Change List Order'
              className='overToolSort liteToolOn'
              defaultValue={sortBy}
              onClick={(e)=>changeSort(e)}>
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
          
          <span className='flexSpace' />
          <span>Updated {duration} ago</span>
        </nav>
          
        <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
          <div className={`overGridFrame ${density}`}>
      
            <BatchHeaders
              key='fancylist0'
              oB={liveState}
              bCache={bCache}
              dense={dense > 1}
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
        </div>
        
      </div>
    </AnimateWrap>
  );
};

export default OverviewWrap;