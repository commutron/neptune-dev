import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import PriorityList from './cards/PriorityList';
import ShipDates from './cards/ShipDates';
import ShipWindows from './cards/ShipWindows';


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

const AgendaWrap = ({ 
  batches, batchesX, 
  bCache, pCache, cCache, 
  user, clientTZ, app 
})=> {

  const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
  const [ tickingTime, tickingTimeSet ] = useState( moment() );
  
  const [ filterBy, filterBySet ] = useState( false );

  const [ dense, denseSet ] = useState( 0 );
  
  const [ liveState, liveSet ] = useState( false );
  
  const [ numState, numSet ] = useState(false);
  
  useEffect( ()=> {
    
    const q2tArr = Array.from(pCache.dataSet, 
      x => x.quote2tide > 0 && x.quote2tide );
    const q2tTotal = q2tArr.reduce( 
      (arr, x)=> typeof x === 'number' && arr + x, 0 );
      
    const howManyHours = moment.duration(q2tTotal, "minutes")
                          .asHours().toFixed(2, 10);
                          
    const now = moment();
    const in100 = now.clone().add(100, 'd');
    const noDays = app.nonWorkDays;
    const noDays100 = noDays.filter( x => moment(x).isBetween(now, in100, null, '[)'));
    const noNice = noDays100.join(', ');
    
    numSet([
      ['q2tTotal', q2tTotal],
      ['howManyHours', howManyHours], 
      ['holidaysInNext100Days', noNice], 
    ]);
  }, []);
  
  useEffect( ()=> {
    sortInitial();
  }, [filterBy]);

  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
  
  function changeFilter(e) {
    const value = e.target.value;
    const filter = value === 'false' ? false : value;
    filterBySet( filter );
  }
  
  function forceRefresh() {
    workingSet( true );
    liveSet( false );
    Meteor.call('FORCEcacheUpdate', clientTZ, ()=>{
      sortInitial();
      loadTimeSet( moment() );
      workingSet( false );
    });
  }
  
  function sortInitial() {
    return new Promise((resolve) => {
      
      let liveBatches = [...batches,...batchesX];
      
      // const releasedToFloor = Array.isArray(bx.releases) ?
      //   bx.releases.findIndex( x => x.type === 'floorRelease') >= 0 :
      //   typeof bx.floorRelease === 'object';

      //const cB = cCache.dataSet.find( x => x.batchID === bx._id);
      //const cP = cB && cB.phaseSets.find( x => x.phase === filterBy );
      
      let orderedBatches = liveBatches.sort((b1, b2)=> {
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
      
      liveSet( orderedBatches );
    });
  }
   
  const duration = moment.duration(
    loadTime.diff(tickingTime))
      .humanize();
      
  const density = dense === 1 ? 'compact' :
                  dense === 2 ? 'minifyed' :
                  '';
    
  return(
    <div key={0} className='overviewContainer'>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='frontCenterTitle'>Agenda Alpha</div>
        <div className='auxRight'>
          <button
            type='button'
            title='Refresh Data'
            className={working ? 'spin2' : ''}
            onClick={(e)=>forceRefresh()}>
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
        
      {!liveState ?
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      :  
        <div className={`balance numFont letterSpaced overscroll ${density}`}>
            
          <ShipWindows 
            pCache={pCache.dataSet}
            app={app} />
           
          <div className='max400 space'>
            <h3>Other</h3>
            <h5></h5>
            <dl>
              {!numState ? 'sure' :
                numState.map( (entry, index)=>{
                return(
                  <dd key={index}>{entry[0]}: {entry[1]}</dd>
              )})}
            </dl>
          </div>

          <PriorityList 
            pCache={pCache.dataSet}
            app={app} />

          <ShipDates 
            pCache={pCache.dataSet}
            app={app} />
            
        </div>
      }  
      </div>
    </div>
  );
};

export default AgendaWrap;