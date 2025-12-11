import React from 'react';
import Pref from '/client/global/pref.js';

export const SortSelect = ({ sortState, changeFunc, extraClass })=> (
  <span className='liteTip' data-tip='Sort list by'>
    <i className='fa-solid fa-sort-amount-down fa-fw darkgrayT'></i>
    <select
      id='sortSelect'
      className={`overToolSort liteToolOn ${extraClass || ''}`}
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
  <span className='liteTip' data-tip={`Filter by ${Pref.group}`}>
    <i className='fa-solid fa-industry fa-fw darkgrayT'></i>
    <select
      id='focusSelect'
      className='overToolSort liteToolOn'
      defaultValue={focusState}
      onChange={(e)=>changeFunc(e)}>
      <option value={false} className='clean'>All {Pref.Group}s</option>
      {gList.map( (gr, ix)=> (
        <option key={gr+ix}>{gr}</option>
      ))}
    </select>
  </span>
);

export const FilterSelect = ({ 
  unqID, title, selectList, selectState, falsey, changeFunc, 
  extraClass, icon, optgroup
})=> (
  <span className='liteTip' data-tip={title}>
    <i className={`${icon || 'fas fa-filter'} fa-fw darkgrayT`}></i>
    <select
      id={'filterSelect'+unqID}
      className={`overToolSort liteToolOn ${extraClass || ''}`}
      defaultValue={selectState}
      onChange={(e)=>changeFunc(e)}
      disabled={selectList.length === 0}>
      {falsey !== undefined &&
        <option value={false}>{falsey}</option>
      }
      {optgroup ?
        selectList.map( (lset, sindex)=> (
          <optgroup key={'gr'+sindex} label={lset[0]}>
            {lset[1].map( (op, ix)=> {
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
          </optgroup>
        ))
      :
        selectList.map( (op, ix)=> {
          if(Array.isArray(op)) {
            return(
              <option key={op[0]+'x'+ix} value={op[0]}>{op[1]}</option>
            );
          }else{
            return(
              <option key={op+'x'+ix}>{op}</option>
            );
          }
        })
      }
    </select>
  </span>
);

export const YearSelect = ({ 
  yearsList, append, falsey, filterState, changeFunc, extraClass
})=> (
  <span className='liteTip' data-tip='Filter by Year'>
    <i className='fa-solid fa-calendar-alt fa-fw darkgrayT'></i>
    <select
      id='yearSelect'
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
    <ToolButton
      kID='denseOff'
      tip='Comfort Layout'
      changeFunc={changeFunc}
      stateVal={denseState}
      onVal={false}
      icon='fa-solid fa-expand'
    />
    <ToolButton
      kID='miniOn'
      tip='Minifyed Layout'
      changeFunc={changeFunc}
      stateVal={denseState}
      onVal={true}
      icon='fa-solid fa-compress'
    />
  </span>
);

export const ThemeSwitch = ({ themeState, changeFunc })=> (
  <span>
    <ToolButton
      kID='darkOn'
      tip='Dark Theme'
      changeFunc={changeFunc}
      stateVal={themeState}
      onVal={false}
      icon='fa-solid fa-moon'
    />
    <ToolButton
      kID='lightOn'
      tip='Light Theme'
      changeFunc={changeFunc}
      stateVal={themeState}
      onVal={true}
      icon='fa-solid fa-sun'
    />
  </span>
);

export const ProgSwitch = ({ progState, changeFunc })=> (
  <span>
    <ToolButton
      kID='progOn'
      tip='Progress'
      changeFunc={changeFunc}
      stateVal={progState}
      onVal={false}
      icon='fa-solid fa-bars-progress'
    />
    <ToolButton
      kID='timeOn'
      tip='Task Time'
      changeFunc={changeFunc}
      stateVal={progState}
      onVal={true}
      icon='fa-regular fa-hourglass'
    />
  </span>
);

export const StormySwitch = ({ stormState, changeFunc })=> (
  <span>
    <ToolButton
      kID='stormyOFF'
      changeFunc={changeFunc}
      stateVal={stormState}
      onVal={false}
      icon='fas fa-slash'
      tip='Problem Filter Off'
    />
    <ToolButton
      kID='ncOn'
      changeFunc={changeFunc}
      stateVal={stormState}
      onVal={0}
      icon='fas fa-times-circle'
      tip={'Outstanding ' + Pref.nonCons}
    />
    <ToolButton
      kID='shOn'
      changeFunc={changeFunc}
      stateVal={stormState}
      onVal={1}
      icon='fas fa-exclamation'
      tip={'Outstanding ' + Pref.shortfalls}
    />
    <ToolButton
      kID='tfOn'
      changeFunc={changeFunc}
      stateVal={stormState}
      onVal={2}
      icon='fas fa-microchip'
      tip='Test Failures'
    />
  </span>
);

const ToolButton = ({ kID, changeFunc, stateVal, onVal, icon, tip })=> (
  <button
    key={kID}
    onClick={()=>changeFunc(onVal)}
    className={`liteTip ${stateVal === onVal ? 'liteToolOn' : 'liteToolOff'}`}
    data-tip={tip}
  ><i className={`${icon} fa-fw`}></i></button>
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