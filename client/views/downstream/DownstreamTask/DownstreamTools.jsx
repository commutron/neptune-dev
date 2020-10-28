import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import ClockString from '/client/components/smallUi/ClockString';


const DownstreamTools = ({
  app, loadTimeUP, 
  numUp, sortByUP, denseUP, lightUP,
  changeNumUP, changeSortUP, denseSetUP, themeSetUP
})=> {
   
  
        
  return(
    <nav className='downstreamToolbar gridViewTools'>
      
      <span>
        <i className='fas fa-sort-numeric-down fa-fw darkgrayT'></i>
        <input
          type='range'
          id='numTick'
          title='Change Number of Days'
          className='overToolSort liteToolOn'
          pattern='[0-99]*'
          maxLength='2'
          minLength='1'
          max='24'
          min='1'
          inputMode='numeric'
          defaultValue={numUp}
          onChange={(e)=>changeNumUP(e)} />
      </span>
      
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
      <ClockString loadTime={loadTimeUP} />
    </nav>
  );
};

export default DownstreamTools;