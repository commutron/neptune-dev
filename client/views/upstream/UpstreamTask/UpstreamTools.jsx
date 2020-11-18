import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, SortSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const UpstreamTools = ({
  app, traceDT, loadTimeUP,
  focusByUP, changeFocusByUP,
  sortByUP, denseUP, lightUP,
  changeSortUP, denseSetUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter( f => f ).sort();
  return(
    <nav className='overviewToolbar gridViewTools'>
      
      <SortSelect
        sortState={sortByUP}
        changeFunc={changeSortUP}
      />
      
      <FocusSelect
        gList={gList}
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
      <ClockString loadTime={loadTimeUP} doThing={doThing} />
    </nav>
  );
};

export default UpstreamTools;