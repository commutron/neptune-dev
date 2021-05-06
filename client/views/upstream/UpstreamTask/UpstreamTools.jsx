import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, FilterSelect, SortSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const UpstreamTools = ({
  app, traceDT, loadTimeUP,
  focusByUP, changeFocusByUP,
  salesByUP, sortByUP, denseUP, lightUP,
  changeSalesUP, changeSortUP, denseSetUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter( f => f ).sort();
  
  const slList = _.uniq( Array.from(traceDT, s => 
          !s.isWhat[0].startsWith('.') && s.isWhat[0] === focusByUP ? 
            s.salesOrder : null ) ).filter(f=>f).sort();
            
  return(
    <nav className='overviewToolbar gridViewTools'>
      
      <FocusSelect
        gList={gList}
        focusState={focusByUP}
        changeFunc={changeFocusByUP}
      />
      
      <FilterSelect
        unqID='fltrSALES'
        title='Filter Sales Order'
        selectList={slList}
        selectState={salesByUP}
        falsey='All Sales Orders'
        changeFunc={changeSalesUP} 
      />
      
      <SortSelect
        sortState={sortByUP}
        changeFunc={changeSortUP}
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