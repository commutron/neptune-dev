import React, {useState, useEffect, useRef, Fragment} from 'react';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
// import Pref from '/client/global/pref.js';

// import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

// import PriorityList from './cards/PriorityList';
// import ShipDates from './cards/ShipDates';
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
  bCache, pCache, zCache,
  user, clientTZ, app 
})=> {

  const [ working, workingSet ] = useState( false );
  const [ loadTime, loadTimeSet ] = useState( moment() );
  const [ tickingTime, tickingTimeSet ] = useState( moment() );
  
  const [ numState, numSet ] = useState(false);
  
  useEffect( ()=> {
    
    const q2tArr = Array.from(pCache.dataSet, x => 
                      typeof x.quote2tide === 'number' && x.quote2tide );
    const q2tTotal = q2tArr.reduce( (arr, x)=> x > 0 ? arr + x : arr, 0 );
    const howManyHours = moment.duration(q2tTotal, "minutes")
                          .asHours().toFixed(2, 10);
                          
    const now = moment();
    const in100 = now.clone().add(100, 'd');
    const noDays = app.nonWorkDays;
    const noDays100 = noDays.filter( x => {
      if(x.substring(0, 1) === '*') {
        const wildA = x.replace('*', now.year()); 
        const wildB = x.replace('*', in100.year());
        return moment(wildA).isBetween(now, in100, null, '[)') ||
                moment(wildB).isBetween(now, in100, null, '[)');
      }else{
        return moment(x).isBetween(now, in100, null, '[)');
      }
    }).sort();
    const noDays100Nice = Array.from(noDays100, x =>
      moment(x).format("dddd, MMMM Do YYYY") );
    
    numSet([
      ['q2tTotal', q2tTotal.toFixed(2, 10)],
      ['howManyHours', howManyHours],
      ['100daysFromNow', in100.calendar()],
      ['nonWorkDaysInNext100Days', noDays100Nice], 
    ]);
  }, [pCache, workingSet, app]);

  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
  
  
  function requestRefresh() {
    workingSet( true );
    // batchUp, priorityUp, activityUp, phaseUp, compUp
    Meteor.call('REQUESTcacheUpdate', clientTZ, true, true, ()=>{
      loadTimeSet( moment() );
      workingSet( false );
    });
  }
   
  const duration = moment.duration(
    loadTime.diff(tickingTime))
      .humanize();
    
  return(
    <div key={0} className='overviewContainer'>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader'>
        <div className='topBorder'></div>
        <HomeIcon />
        <div className='frontCenterTitle'>Agenda<sup className='big monoFont'>ALPHA</sup></div>
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
        <span className='flexSpace' />
        <span>Updated {duration} ago</span>
      </nav>
    
      <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
      <div className='balance numFont letterSpaced overscroll'>
            
          <ShipWindows 
            bCache={bCache.dataSet}
            pCache={pCache.dataSet}
            zCache={zCache.dataSet}
            app={app} />
           
          <div className='max400 space line2x'>
            <h3>High Level</h3>
            <h5></h5>
            <dl>
              {!numState ? '...' :
                numState.map( (entry, index)=>{
                if( Array.isArray(entry[1]) ) {
                  return(
                    <Fragment key={index}>
                      <dt>{entry[0]}:</dt>
                      {entry[1].map( (d, ix)=>( <dd key={ix}>{d}</dd> ))}
                    </Fragment>
                  );
                }else{
                  return(
                    <dt key={index}>{entry[0]}: {entry[1]}</dt>
                  );
                }
              })}
            </dl>
          </div>
        {/*
          <PriorityList 
            pCache={pCache.dataSet}
            app={app} />

          <ShipDates 
            pCache={pCache.dataSet}
            app={app} />
        */}   
        </div>
      </div>
    </div>
  );
};

export default AgendaWrap;