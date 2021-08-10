import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import LeapButton from '/client/components/tinyUi/LeapButton';
import FilterActive from '/client/components/bigUi/FilterActive';


const WidgetsList = ({ active, widgetData, groupAlias })=> {
  
  const [ filter, filterSet ] = useState(false);
  const [ textString, textStringSet ] = useState('');
  const [ showListState, showListSet ] = useState(widgetData);
  
  function setTextFilter(rule) {
    textStringSet( rule.toLowerCase() );
  }
  
  useEffect( ()=> {
    const a = active;
    const w = widgetData.sort((w1, w2)=> {
                if (w1.widget < w2.widget) { return -1 }
                if (w1.widget > w2.widget) { return 1 }
                return 0;
              });
    const f = filter;
  
    let basicFilter = 
      f === 'done' ?
      w.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      w.filter( x => a.includes(x._id) !== false ) :
      w;
    let showList = basicFilter.filter( 
      tx => tx.widget.toLowerCase().includes(textString) === true ||
            tx.describe.toLowerCase().includes(textString) === true);
    showListSet(showList);
  }, [ active, filter, textString ]);
  
  return(
    <div className='' key={1}>
      <div className='stickyBar'>
        <FilterActive
          title={groupAlias.alias}
          done='Inactive'
          total={showListState.length}
          onClick={e => filterSet(e)}
          onTxtChange={e => setTextFilter(e)} />
      </div>
      {widgetData.length < 1 ? <p>no {Pref.widget}s created</p> : null}
        {showListState.map( (entry, index)=> {
        let ac = active.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
          return (
            <LeapButton
              key={index}
              title={entry.widget}
              sub={entry.describe}
              sty={ac}
              address={'/data/widget?request=' + entry.widget}
            />
        )})}
    </div>
  );
};
  
export default WidgetsList;