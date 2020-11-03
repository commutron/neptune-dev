import React from 'react';
import ClockString from '/client/components/smallUi/ClockString';
import { 
  FocusSelect,
  LayoutSwitch, ThemeSwitch
} from '/client/components/smallUi/ToolBarTools';


const DownstreamTools = ({
  app, bCache, loadTimeUP, 
  numUP, changeNumUP,
  focusByUP, changeFocusByUP,
  sortByUP, denseUP, lightUP,
  changeSortUP, denseSetUP, themeSetUP
})=> (
  <nav className='downstreamToolbar gridViewTools'>
    
    <span>
      <i className='darkgrayT numFont'>{numUP > 9 ? numUP : '0'+numUP}</i>
      <i className='fas fa-calendar-day fa-fw darkgrayT'></i>
      <input
        type='range'
        id='numTick'
        title='Change Number of Days'
        className='overToolSort liteToolOn'
        pattern='[0-99]*'
        maxLength='2'
        minLength='1'
        max='24'
        min='1'
        inputMode='numeric'
        defaultValue={numUP}
        onChange={(e)=>changeNumUP(e)} />
    </span>
      
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

export default DownstreamTools;