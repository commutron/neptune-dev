import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  SortSelect, 
  FocusSelect, FilterSelect, ProgSwitch,
  // LayoutSwitch, 
  ThemeSwitch, StormySwitch
} from '/client/components/smallUi/ToolBarTools';

const OverviewTools = ({
  app, traceDT, loadTimeUP,
  focusByUP, changeFocusByUP,
  salesByUP, changeSalesUP,
  sortByUP, changeSortUP,
  tagBy, changeTagsUP,
  ghostUP, ghostSetUP, 
  progUP, progSetUP,
  lightUP, themeSetUP,
  stormy, stormySet,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter(f=>f).sort();
                            
  const slList = _.uniq( Array.from(traceDT, s => 
          !s.isWhat[0].startsWith('.') && s.isWhat[0] === focusByUP ? 
            s.salesOrder : null ) ).filter(f=>f).sort();
  
  const tList = _.uniq( Array.from(traceDT, t => t.tags ).filter(f=>f).flat() ).sort();
  
  return(
    <nav className={`overviewToolbar gridViewTools ${lightUP === true ? 'lightTheme' : 'darkTheme'}`}>
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
    
      <span>
        <button
          key='ghostToggle'
          data-tip="Future / 'In Kitting'"
          onClick={()=>ghostSetUP(!ghostUP)}
          className={`liteTip ${!ghostUP ? 'liteToolOff' : 'liteToolOn'}`}
          style={{'cursor':'pointer'}}
        ><i className='fas fa-history fa-fw' 
            data-fa-transform="flip-h"
          ></i>
        </button>
      </span>
      
      <ProgSwitch
        progState={progUP}
        changeFunc={progSetUP} 
      />
      
      <StormySwitch
        stormState={stormy}
        changeFunc={stormySet} 
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