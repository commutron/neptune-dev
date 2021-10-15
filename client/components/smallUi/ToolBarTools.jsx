import React from 'react';
import Pref from '/client/global/pref.js';


export const BranchFilterSelect = ({ brancheS, filterState, changeFunc })=> (
  <span>
    <i className='fas fa-code-branch fa-fw darkgrayT'></i>
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
      <option value='batch'>{Pref.xBatch}</option>
      <option value='sales'>{Pref.salesOrder}</option>
      <option value='due'>due date</option>
    </select>
  </span>
);


export const FocusSelect = ({ gList, focusState, changeFunc })=> (
  <span>
    <i className='fas fa-industry fa-fw darkgrayT'></i>
    <select
      id='focusSelect'
      title={`Focus on ${Pref.group}`}
      className={`overToolSort liteToolOn`}
      defaultValue={focusState}
      onChange={(e)=>changeFunc(e)}>
      <option value={false} className='clean'>All {Pref.group}s</option>
      {gList.map( (gr, ix)=> (
        <option key={gr+ix}>{gr}</option>
      ))}
    </select>
  </span>
);

export const FilterSelect = ({ 
  unqID, title, selectList, selectState, falsey, changeFunc, extraClass, icon
})=> (
  <span>
    <i className={`${icon || 'fas fa-filter'} fa-fw darkgrayT`}></i>
    <select
      id={'filterSelect'+unqID}
      title={title}
      className={'overToolSort liteToolOn ' + extraClass || ''}
      defaultValue={selectState}
      onChange={(e)=>changeFunc(e)}
      disabled={selectList.length === 0}>
      {falsey !== undefined &&
        <option value={false}>{falsey}</option>
      }
      {selectList.map( (op, ix)=> {
        if(Array.isArray(op)) {
          return(
            <option key={op[0]+'x'+ix} value={op[0]}>{op[1]}</option>
          );
        }else{
          return(
            <option key={op+'x'+ix}>{op}</option>
          );
        }
      })}
    </select>
  </span>
);

export const YearSelect = ({ 
  yearsList, append, falsey, filterState, changeFunc, extraClass
})=> (
  <span>
    <i className='fas fa-calendar-alt fa-fw darkgrayT'></i>
    <select
      id='yearSelect'
      title='Filter by Year'
      className={`overToolSort liteToolOn ${extraClass || ''}`}
      defaultValue={filterState}
      onChange={(e)=>changeFunc(e.target.value)}>
      <option value={false} className='clean'>{falsey}</option>
      {yearsList.map( (yr, ix)=> (
        <option key={yr+'-'+ix} value={yr}>{yr}{append}</option>
      ))}
    </select>
  </span>
);

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

export const ToggleSwitch = ({ 
  tggID, toggleLeft, toggleRight, toggleVal, toggleSet, lockout
})=> (
  <label className='beside' style={{margin: '0 20px',textAlign: 'center'}}
    >{toggleLeft}
    <input
      type='range'
      id={tggID}
      max={1}
      min={0}
      step={1}
      className='minHeight'
      style={{width: '35px',filter: 'grayscale(100%)'}}
      inputMode='numeric'
      defaultValue={toggleVal ? 1 : 0}
      onChange={(e)=>toggleSet(e.target.value == 1 ? true : false)} 
      disabled={lockout}
    />{toggleRight}
  </label>
);