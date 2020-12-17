import React, { useState, useEffect, Fragment } from 'react';
// import Pref from '/client/global/pref.js';
import LeapLine from '/client/components/tinyUi/LeapLine';

const BatchNewList = ({ 
  batchData, widgetData, variantData, groupData, app, daysBack
}) => {
  
  const [ showListState, showListSet ] = useState( [] );

  useEffect( ()=> {
    const ystrday = ( d => new Date(d.setDate(d.getDate()-daysBack)) )(new Date);
    
    const recBatch = batchData.filter( b => b.createdAt > ystrday );
    
    const w = widgetData;
    const v = variantData;
    const g = groupData;
    let blendedList = [];
    for(let b of recBatch){
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
    let sortList = blendedList.sort((b1, b2)=> 
                    b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0 );
    showListSet( sortList );
  }, [batchData]); 
  
  if(showListState.length > 0) {
    return(
      <Fragment>
        {showListState.map( (ent, index)=> {
          if(!ent[6]) { return null }else{
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
  		</Fragment>
    );
  }
  return null;
};

export default BatchNewList;