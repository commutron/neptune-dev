import React from 'react';
import Pref from '/client/global/pref.js';


export const BranchFilterSelect = ({ brancheS, filterState, changeFunc })=> (
  <span>
    <i className='fas fa-filter fa-fw darkgrayT'></i>
    <select
      id='filterSelect'
      title={`Change ${Pref.branch} Filter`}
      className='overToolSort liteToolOn'
      defaultValue={filterState}
      onChange={(e)=>changeFunc(e)}>
      <option value={false}>All</option>
      {brancheS.map( (br, ix)=> {
        return(
          <option key={br.brKey+ix} value={br.branch}>{br.branch}</option>
      )})}
    </select>
  </span>
);


export const SortSelect = ({ sortState, changeFunc })=> (
  <span>
    <i className='fas fa-sort-amount-down fa-fw darkgrayT'></i>
    <select
      id='sortSelect'
      title='Change list order'
      className='overToolSort liteToolOn'
      defaultValue={sortState}
      onChange={(e)=>changeFunc(e)}>
      <option value='priority'>priority</option>
      <option value='batch'>{Pref.batch}</option>
      <option value='sales'>{Pref.salesOrder}</option>
      <option value='due'>due date</option>
    </select>
  </span>
);


export const FocusSelect = ({ bCacheData, focusState, changeFunc })=> {
  
  const groupList = _.uniq( Array.from(bCacheData, g =>
                              !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                                .filter( f => f ).sort();

  return(
    <span>
      <i className='fas fa-industry fa-fw darkgrayT'></i>
      <select
        id='focusSelect'
        title={`Focus on ${Pref.group}`}
        className='overToolSort liteToolOn'
        defaultValue={focusState}
        onChange={(e)=>changeFunc(e)}>
        <option value={false}>All {Pref.group}s</option>
        {groupList.map( (gr, ix)=> {
          return(
            <option key={gr+ix}>{gr}</option>
        )})}
      </select>
    </span>
  );
};


export const LayoutSwitch = ({ denseState, changeFunc })=> (
  <span>
    <button
      key='denseOff'
      title='Comfort Layout'
      onClick={()=>changeFunc(false)}
      className={!denseState ? 'liteToolOn' : 'liteToolOff'}
    ><i className='fas fa-expand fa-fw'></i></button>
    
    <button
      key='miniOn'
      title='Minifyed Layout'
      onClick={()=>changeFunc(true)}
      className={denseState ? 'liteToolOn' : 'liteToolOff'}
    ><i className='fas fa-compress fa-fw'></i></button>
  </span>
);

export const ThemeSwitch = ({ themeState, changeFunc })=> (
  <span>
    <button
      key='darkOn'
      title='Dark Theme'
      onClick={()=>changeFunc(false)}
      className={themeState === false ? 'liteToolOn' : 'liteToolOff'}
    ><i className='fas fa-moon fa-fw'></i></button>
    <button
      key='lightOn'
      title='Light Theme'
      onClick={()=>changeFunc(true)}
      className={themeState === true ? 'liteToolOn' : 'liteToolOff'}
    ><i className='fas fa-sun fa-fw'></i></button>
  </span>
);