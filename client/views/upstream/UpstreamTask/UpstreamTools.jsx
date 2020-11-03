import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, //SortSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const UpstreamTools = ({
  app, bCache, loadTimeUP,
  focusByUP, changeFocusByUP,
  sortByUP, denseUP, lightUP,
  changeSortUP, denseSetUP, themeSetUP
})=> (
  <nav className='overviewToolbar gridViewTools'>
    
    {/*<SortSelect
      sortState={sortByUP}
      changeFunc={changeSortUP}
    />*/}
    
    <FocusSelect
      bCacheData={bCache.dataSet}
      focusState={focusByUP}
      changeFunc={changeFocusByUP}
    />
      
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

export default UpstreamTools;