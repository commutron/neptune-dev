import React, { useState, useEffect } from 'react';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';

const BatchesListWide = ({ 
  batchData, widgetData, variantData, groupData, app 
}) => {
  
  const [ allState, allSet ] = useState(false);
  
  const [ textString, textStringSet ] = useState( '' );
  const [ blendedListState, blendedListSet ] = useState( [] );
  const [ showListState, showListSet ] = useState( [] );

  function setTextFilter(rule) {
    textStringSet(rule.toLowerCase());
  }

  useEffect( ()=> {
    const w = widgetData;
    const v = variantData;
    const g = groupData;
    //const bDt = allState ? batchData : batchData.filter( x => x.live === true);
    let blendedList = [];
    for(let b of batchData){
      const subW = w.find( x => x._id === b.widgetId);
      const subV = v.find( x => x.versionKey === b.versionKey);
      const subG = g.find( x => x._id === subW.groupId);
      blendedList.push([
        b.batch,
        b.salesOrder || 'n/a',
        subG.alias,
        subW.widget, 
        subV.variant,
        b.tags,
        b.live
      ]);
    }
    blendedListSet( blendedList );
  }, []); 
    
  useEffect( ()=> {
    let showList = blendedListState.filter( tx =>
                    JSON.stringify(tx).toLowerCase().includes(textString) === true );
    let sortList = showList.sort((b1, b2)=> {
                if (b1[0] < b2[0]) { return 1 }
                if (b1[0] > b2[0]) { return -1 }
                return 0;
              });
    showListSet( sortList );
  }, [ blendedListState, textString ]);
  
  return(
    <div className='centre' key={1}>
      <div className='tableList'>
        <div>
          <DumbFilter
            id='batchOverview'
            size='bigger'
            onTxtChange={e => setTextFilter(e)}
            labelText='Filter any text, not case-sensitve.'
            list={app.tagOption} />
          <div className='centre'>
            <label className='inlineForm medBig'>
              <input
                type='checkbox'
                title='Show Complete'
                id='chkAll'
                className='tableAction'
                checked={allState}
                onChange={(e)=>allSet(e.target.checked)}
            />Show Complete</label>
          </div>
        </div>

        {showListState.map( (entry, index)=> {
          const tags = entry[5].map( (et, ix)=>{
            return(<span key={ix} className='tagFlag'><i>{et}</i></span>);
          });
          if(!allState && !entry[6]) { return null }else{
            const sty = !entry[6] ? 'numFont gMark' : 'numFont activeMark';
            return(
              <LeapRow
                key={"wo"+index}
                title={entry[0].toUpperCase()}
                cTwo={<i><i className='smaller'>so: </i>{entry[1].toUpperCase()}</i>}
                cThree={entry[2].toUpperCase()}
                cFour={entry[3].toUpperCase() + ' v.' + entry[4]}
                cFive={tags}
                sty={`${sty} lastSpanRight`}
                address={'/data/batch?request=' + entry[0]}
              />
        )}})}

      </div>
		</div>
  );
};

export default BatchesListWide;