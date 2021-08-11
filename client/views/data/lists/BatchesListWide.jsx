import React, { useState, useEffect } from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';
import DumbFilter from '/client/components/tinyUi/DumbFilter';

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
        b.live
      ]);
    }
    blendedListSet( blendedList );
  }, []); 
    
  useEffect( ()=> {
    let showList = blendedListState.filter( tx =>
                    JSON.stringify(tx).toLowerCase().includes(textString) === true );
    let sortList = showList.sort((b1, b2)=> 
                    b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0 );
    showListSet( sortList );
  }, [ blendedListState, textString ]);
  
  return(
    <div className='centre' key={1}>
      <div className=''>
        <div>
          <DumbFilter
            id='batchOverview'
            size='bigger'
            onTxtChange={(e)=>setTextFilter(e)}
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

        {showListState.map( (ent, index)=> {
          if(!allState && !ent[6]) { return null }else{
            const sty = !ent[6] ? 'numFont gMark' : 'numFont activeMark';
            return(
              <LeapLine
                key={"wo"+index}
                title={ent[0].toUpperCase()}
                cTwo={<i><i className='smaller'>so: </i>{ent[1].toUpperCase()}</i>}
                cThree={`${ent[2].toUpperCase()}`}
                cFour={`${ent[3].toUpperCase()} v.${ent[4]}`}
                sty={sty}
                address={'/data/batch?request=' + ent[0]}
              />
        )}})}

      </div>
		</div>
  );
};

export default BatchesListWide;