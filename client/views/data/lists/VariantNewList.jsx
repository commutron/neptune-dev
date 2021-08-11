import React, { useState, useEffect, Fragment } from 'react';
import LeapLine from '/client/components/tinyUi/LeapLine';

const VariantNewList = ({ 
  widgetData, variantData, groupData, app, daysBack
}) => {
  
  const [ showListState, showListSet ] = useState( [] );

  useEffect( ()=> {
    const ystrday = ( d => new Date(d.setDate(d.getDate()-daysBack)) )(new Date);
    
    const recVar = variantData.filter( b => b.createdAt > ystrday );
    
    const w = widgetData;
    const g = groupData;
    let blendedList = [];
    for(let v of recVar){
      const subW = w.find( x => x._id === v.widgetId);
      const subG = g.find( x => x._id === subW.groupId);
      blendedList.push([
        subG.alias,
        subW.widget,
        subW.describe,
        v.variant
      ]);
    }
    let sortList = blendedList.sort((v1, v2)=> 
                    v1[0] < v2[0] ? 1 : v1[0] > v2[0] ? -1 : 0 );
    showListSet( sortList );
  }, [variantData]); 
  
  if(showListState.length > 0) {
    return(
      <Fragment>
        {showListState.map( (ent, index)=> {
          return(
            <LeapLine
              key={"var"+index}
              title={ent[3]}
              cTwo={ent[0].toUpperCase()}
              cThree={ent[1].toUpperCase()}
              cFour={ent[2].toUpperCase()}
              sty='numFont activeMark'
              address={'/data/widget?request=' + ent[1] + '&specify=' + ent[3]}
            />
        )})}
  		</Fragment>
    );
  }
  return null;
};

export default VariantNewList;