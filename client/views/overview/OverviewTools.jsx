import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  BranchFilterSelect, SortSelect, 
  FocusSelect, FilterSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const OverviewTools = ({
  app, traceDT, brancheS, loadTimeUP,
  filterByUP, changeFilterUP,
  focusByUP, changeFocusByUP,
  salesByUP, changeSalesUP,
  sortByUP, changeSortUP,
  ghostUP, ghostSetUP, 
  denseUP, denseSetUP,
  lightUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter(f =>f).sort();
                            
  const slList = _.uniq( Array.from(traceDT, s => 
          !s.isWhat[0].startsWith('.') && s.isWhat[0] === focusByUP ? 
            s.salesOrder : null ) ).filter(f=>f).sort();

  return(
    <nav className='overviewToolbar gridViewTools'>
      
      <BranchFilterSelect
        brancheS={brancheS}
        filterState={filterByUP}
        changeFunc={changeFilterUP}
      />
      
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
      <ClockString loadTime={loadTimeUP} doThing={doThing} />
    </nav>
  );
};

export default OverviewTools;