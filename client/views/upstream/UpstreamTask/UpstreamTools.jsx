import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, FilterSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const UpstreamTools = ({
  app, traceDT, loadTimeUP,
  focusByUP, changeFocusByUP,
  salesByUP, denseUP, lightUP,
  changeSalesUP, denseSetUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter( f => f ).sort();
  
  const slList = _.uniq( Array.from(traceDT, s => s.salesOrder ) ).sort();
  
  return(
    <nav className='overviewToolbar gridViewTools'>
      
      {/*<SortSelect
        sortState={sortByUP}
        changeFunc={changeSortUP}
      />*/}
      
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