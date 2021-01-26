import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterActive from '/client/components/bigUi/FilterActive.jsx';

const WidgetsList = ({ active, widgetData, groupAlias })=> {
  
  const [ filterState, filterSet ] = useState(false);
  const [ textString, textStringSet ] = useState('');
  const [ showListState, showListSet ] = useState(widgetData);
  
  function setTextFilter(rule) {
    textStringSet( rule.toLowerCase() );
  }
  
  useEffect( ()=> {
    const w = widgetData.sort((w1, w2)=>
                  w1.widget < w2.widget ? -1 : w1.widget > w2.widget ? 1 : 0 );
    
    const f = filterState;
  
    let basicFilter = 
      f === 'done' ?
      w.filter( x => active.includes(x._id) === false ) :
      f === 'inproc' ?
      w.filter( x => active.includes(x._id) !== false ) :
      w;
    let showList = basicFilter.filter( 
      tx => tx.widget.toLowerCase().includes(textString) === true ||
            tx.describe.toLowerCase().includes(textString) === true);
    showListSet(showList);
  }, [active, filterState, textString]);
  
  
  return(
    <div key={1}>
    
      <FilterActive
        title={groupAlias.alias}
        done='Inactive'
        total={showListState.length}
        onClick={e => filterSet(e)}
        onTxtChange={e => setTextFilter(e)} />
        
      {widgetData.length < 1 ? <p>no {Pref.widget}s created</p> : null}
        {showListState.map( (entry, index)=> {
        let ac = active.includes(entry._id) ? 'leapBar dark activeMark' : 'leapBar dark';
          return (
            <LeapButton
              key={index}
              title={entry.widget}
              sub={entry.describe}
              sty={ac}
              // address={'/data/widget?request=' + entry.widget}
              address={'/data/widget?request=' + entry._id}
            />
        )})}
    </div>
  );
};

export default WidgetsList;