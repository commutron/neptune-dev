import React, { useState, useEffect } from 'react';

import JumpButton from '/client/components/tinyUi/JumpButton.jsx';
import FilterActive from '/client/components/bigUi/FilterActive.jsx';

const GroupsList = ({ groupData, widgetData, batchData })=> {
  
  const [ filter, filterSet ] = useState( false );
  const [ textString, textStringSet ] = useState( '' );
  const [ activeListState, activeListSet ] = useState( [] );
  const [ showListState, showListSet ] = useState( groupData );
  
  function setFilter(rule) {
    filterSet(rule);
  }
  function setTextFilter(rule) {
    textStringSet(rule.toLowerCase());
  }
  
  useEffect( ()=> {
    let activeBatch = batchData.filter( x => x.active === true);
    
    let activeList = [];
    
    for(let grp of groupData) {
      let widgetsList = widgetData.filter(x => x.groupId === grp._id);
      
      for(let wdgt of widgetsList) {
        let match = activeBatch.find(x => x.widgetId === wdgt._id);
        if(match) {
          activeList.push(grp._id);
          break;
        }else{
          null;
        }
      }
    }
    activeListSet( activeList );
  }, [ groupData, widgetData, batchData ]);

  useEffect( ()=> {
    
    const g = groupData;
    const a = activeListState;
    const f = filter;
    
    let basicFilter = 
      f === 'done' ?
      g.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      g.filter( x => a.includes(x._id) !== false ) :
      g;
    let showList = basicFilter.filter( 
      tx => tx.group.toLowerCase().includes(textString) === true ||
            tx.alias.toLowerCase().includes(textString) === true);
            
    let sortList = showList.sort((g1, g2)=> {
                    if (g1.alias < g2.alias) { return -1 }
                    if (g1.alias > g2.alias) { return 1 }
                    return 0;
                  });
    showListSet(sortList);
  }, [ groupData, filter, textString ]);

  return(
    <div className='section sidebar' key={1}>
    
      <FilterActive
        title={g.alias}
        done='Inactive'
        total={showListState.length}
        onClick={e => setFilter(e)}
        onTxtChange={e => setTextFilter(e)} />
        
      { sortListState.map( (entry)=> {
        let ac = a.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
        return (
          <JumpButton
            key={entry._id}
            title={entry.alias}
            sub=''
            sty={ac}
          />
        )})}
		</div>
  );
};

export default GroupsList;