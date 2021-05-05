import React from 'react';
import Pref from '/client/global/pref.js';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect, FilterSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';


const DownstreamTools = ({
  app, traceDT, loadTimeUP, 
  numUP, changeNumUP,
  focusByUP, changeFocusByUP,
  salesByUP, denseUP, lightUP,
  changeSalesUP, denseSetUP, themeSetUP,
  doThing
})=> {
  const gList = _.uniq( Array.from(traceDT, g =>
                          !g.isWhat[0].startsWith('.') && g.isWhat[0] ))
                            .filter( f => f ).sort();
                            
  const slList = _.uniq( Array.from(traceDT, s => 
          !s.isWhat[0].startsWith('.') && s.isWhat[0] === focusByUP ? 
            s.salesOrder : null ) ).filter(f=>f).sort();
            
  return(
    <nav className='downstreamToolbar gridViewTools'>
      
      <span>
        <i className='darkgrayT numFont'>{numUP > 9 ? numUP : '0'+numUP}</i>
        <i className='fas fa-calendar-day fa-fw darkgrayT'></i>
        <input
          type='range'
          id='numTick'
          title='Change Number of Days'
          className='overToolSort liteToolOn'
          max={Pref.downDayMax.toString()}
          min='1'
          inputMode='numeric'
          defaultValue={numUP}
          onChange={(e)=>changeNumUP(e)} />
      </span>
      
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

export default DownstreamTools;