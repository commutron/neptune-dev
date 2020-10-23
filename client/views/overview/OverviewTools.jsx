import React from 'react';
import Pref from '/client/global/pref.js';
import ClockString from '/client/components/smallUi/ClockString';

const OverviewTools = ({
  app, brancheS, loadTimeUP,
  filterByUP, sortByUP, ghostUP, denseUP, lightUP,
  changeFilterUP, changeSortUP, ghostSetUP, denseSetUP, themeSetUP
})=> (
  <nav className='overviewToolbar gridViewTools'>
    <span>
      <i className='fas fa-filter fa-fw darkgrayT'></i>
      <select
        id='filterSelect'
        title={`Change ${Pref.branch} Filter`}
        className='overToolSort liteToolOn'
        defaultValue={filterByUP}
        onChange={(e)=>changeFilterUP(e)}>
        <option value={false}>All</option>
        {brancheS.map( (br, ix)=> {
          return(
            <option key={br.brKey+ix} value={br.branch}>{br.branch}</option>
        )})}
      </select>
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
        key='ghostToggle'
        title='Toggle In Kitting'
        onClick={()=>ghostSetUP(!ghostUP)}
        className={!ghostUP ? 'liteToolOff' : 'liteToolOn'}
        style={{'cursor':'pointer'}}
      ><i className='fas fa-history fa-fw' 
          data-fa-transform="flip-h"
        ></i>
      </button>
      
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
    <div><ClockString loadTime={loadTimeUP} /></div>
  </nav>
);

export default OverviewTools;