import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';

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

const DownstreamTools = ({
  app, loadTimeUP, 
  sortByUP, denseUP, lightUP,
  changeSortUP, denseSetUP, themeSetUP
})=> {
  
  const [ tickingTime, tickingTimeSet ] = useState( moment() );

  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
   
  const duration = moment.duration(
    loadTimeUP.diff(tickingTime))
      .humanize();
        
  return(
    <nav className='overviewToolbar'>
      
      <span>
        <i className='fas fa-sort-amount-down fa-fw darkgrayT'></i>
        <select
          id='sortSelect'
          title='Change List Order'
          className='overToolSort liteToolOn'
          defaultValue={sortByUP}
          onChange={(e)=>changeSortUP(e)}>
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
          onClick={()=>denseSetUP(false)}
          className={!denseUP ? 'liteToolOn' : 'liteToolOff'}
        ><i className='fas fa-expand fa-fw'></i></button>
        
        <button
          key='miniOn'
          title='Minifyed Layout'
          onClick={()=>denseSetUP(true)}
          className={denseUP ? 'liteToolOn' : 'liteToolOff'}
        ><i className='fas fa-compress fa-fw'></i></button>
      </span>
      
      <span>
        <button
          key='darkOn'
          title='Dark Theme'
          onClick={()=>themeSetUP(false)}
          className={lightUP === false ? 'liteToolOn' : 'liteToolOff'}
        ><i className='fas fa-moon fa-fw'></i></button>
        <button
          key='lightOn'
          title='Light Theme'
          onClick={()=>themeSetUP(true)}
          className={lightUP === true ? 'liteToolOn' : 'liteToolOff'}
        ><i className='fas fa-sun fa-fw'></i></button>
      </span>
      
      <span className='flexSpace' />
      <span className='darkgrayT'>Updated {duration} ago</span>
    </nav>
  );
};

export default DownstreamTools;