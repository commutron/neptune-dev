import React, { useState, useEffect } from 'react';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';

const BatchesListWide = ({ batchData, widgetData, groupData, app }) => {
  
  const [ textString, textStringSet ] = useState( '' );
  const [ showListState, showListSet ] = useState( [] );

  function setTextFilter(rule) {
    textStringSet(rule.toLowerCase());
  }

  useEffect( ()=> {
    
    const w = widgetData;
    const g = groupData;
    
    let blendedList = [];
    for(let b of batchData){
      const style = b.live === true ? 'numFont activeMark' : 'numFont gMark';
      const subW = w.find( x => x._id === b.widgetId);
      const subV = subW.versions.find( x => x.versionKey === b.versionKey);
      const subG = g.find( x => x._id === subW.groupId);
      blendedList.push({
        batchNumber: b.batch,
        salesNumber: b.salesOrder || 'n/a',
        groupAlias: subG.alias,
        widget: subW.widget, 
        version: subV.version,
        tags: b.tags,
        highlight: style
      });
    }
    
    let showList = blendedList.filter( 
                    tx => 
                      tx.batchNumber.toLowerCase().includes(textString) === true ||
                      tx.salesNumber.toLowerCase().includes(textString) === true ||
                      tx.groupAlias.toLowerCase().includes(textString) === true ||
                      tx.widget.toLowerCase().includes(textString) === true ||
                      tx.version.toLowerCase().includes(textString) === true ||
                      tx.tags.join('|').toLowerCase().split('|').includes(textString) === true
                  );
    let sortList = showList.sort((b1, b2)=> {
                if (b1.batchNumber < b2.batchNumber) { return 1 }
                if (b1.batchNumber > b2.batchNumber) { return -1 }
                return 0;
              });
    showListSet( sortList );
  }, [ batchData, widgetData, groupData, textString ]);
  
  return(
    <div className='centre' key={1}>
      <div className='tableList'>
        <div className=''>
          <DumbFilter
            id='batchOverview'
            size='bigger'
            onTxtChange={e => setTextFilter(e)}
            labelText='Filter any text, not case-sensitve.'
            list={app.tagOption} />
        </div>

        {showListState.map( (entry, index)=> {
          const tags = entry.tags.map( (et, ix)=>{
            return(<span key={ix} className='tagFlag'><i>{et}</i></span>)});
            return (
              <LeapRow
                key={index}
                title={entry.batchNumber.toUpperCase()}
                cTwo={<i><i className='smaller'>so: </i>{entry.salesNumber.toUpperCase()}</i>}
                cThree={entry.groupAlias.toUpperCase()}
                cFour={entry.widget.toUpperCase() + ' v.' + entry.version}
                cFive={tags}
                sty={entry.highlight + ' lastSpanRight'}
                address={'/data/batch?request=' + entry.batchNumber}
              />
        )})}
      
      </div>
		</div>
  );
};

export default BatchesListWide;