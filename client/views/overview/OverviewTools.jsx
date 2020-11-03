import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  BranchFilterSelect, //SortSelect, 
  FocusSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const OverviewTools = ({
  app, bCache, brancheS, loadTimeUP,
  filterByUP, changeFilterUP,
  focusByUP, changeFocusByUP,
  sortByUP, changeSortUP, 
  ghostUP, ghostSetUP, 
  denseUP, denseSetUP,
  lightUP, themeSetUP
})=> (
  <nav className='overviewToolbar gridViewTools'>
    
    <BranchFilterSelect
      brancheS={brancheS}
      filterState={filterByUP}
      changeFunc={changeFilterUP}
    />
    
    {/*<SortSelect
      sortState={sortByUP}
      changeFunc={changeSortUP}
    />*/}
    
    <FocusSelect
      bCacheData={bCache.dataSet}
      focusState={focusByUP}
      changeFunc={changeFocusByUP}
    />
    
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
      
    <LayoutSwitch
      denseState={denseUP}
      changeFunc={denseSetUP}
    />
    
    <ThemeSwitch
      themeState={lightUP}
      changeFunc={themeSetUP}
    />
    
    <span className='flexSpace' />
    <ClockString loadTime={loadTimeUP} />
  </nav>
);

export default OverviewTools;