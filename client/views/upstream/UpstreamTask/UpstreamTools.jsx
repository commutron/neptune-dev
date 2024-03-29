import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, FilterSelect, SortSelect,
  ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';

const UpstreamTools = ({
  traceDT, loadTimeUP,
  focusByUP, changeFocusByUP,
  salesByUP, changeSalesUP, 
  sortByUP, changeSortUP, 
  tagBy, changeTagsUP,
  lightUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter( f => f ).sort();
  
  const slList = _.uniq( Array.from(traceDT, s => 
          !s.isWhat[0].startsWith('.') && s.isWhat[0] === focusByUP ? 
            s.salesOrder : null ) ).filter(f=>f).sort();
  
  const tList = _.uniq( Array.from(traceDT, t => t.tags ).filter(f=>f).flat() ).sort();
  
  return(
    <nav className='overviewToolbar gridViewTools'>
      
      <FocusSelect
        gList={gList}
        focusState={focusByUP}
        changeFunc={changeFocusByUP}
      />
      
      {focusByUP ?
        <FilterSelect
          unqID='fltrSALES'
          title='Filter by Sales Order'
          selectList={slList}
          selectState={salesByUP}
          falsey='All Sales Orders'
          changeFunc={changeSalesUP}
          icon='fas fa-dollar-sign'
        />
      : null}
      
      <SortSelect
        sortState={sortByUP}
        changeFunc={changeSortUP}
        extraClass='miniIn12'
      />
      
      {tList.length > 0 &&
        <FilterSelect
          unqID='fltrTAGS'
          title='Filter By Tag'
          selectList={tList}
          selectState={tagBy}
          falsey='—'
          changeFunc={changeTagsUP}
          icon='fas fa-tag'
          extraClass='miniIn12'
        />
      }
      
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