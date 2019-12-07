import React, { useState, useEffect } from 'react';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

const GroupsList = ({ groupData, widgetData, batchData, batchDataX })=> {
  
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
    const xBatches = batchDataX.filter( x => x.active === true);
    for(let x of xBatches) { activeList.push(x.groupsId) }
    
    activeListSet( activeList );
  }, [ groupData, widgetData, batchData ]);

  useEffect( ()=> {
    
    const g = groupData.sort((g1, g2)=> {
                if (g1.group < g2.group) { return -1 }
                if (g1.group > g2.group) { return 1 }
                return 0;
              });
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
    showListSet( sortList );
  }, [ groupData, filter, textString ]);
  
  return(
    <div className='' key={1}>
      <div className='stickyBar'>
        <FilterActive
          title={g.alias}
          done='Inactive'
          total={showListState.length}
          onClick={e => setFilter(e)}
          onTxtChange={e => setTextFilter(e)} />
      </div>  
      {showListState.map( (entry, index)=> {
        let ac = a.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
        return(
          <LeapButton
            key={index}
            title={entry.group}
            sub=''
            sty={ac}
            address={'/data/overview?request=groups&specify=' + entry.alias}
          />
        )})}
		</div>
  );
};
  
export default GroupsList;