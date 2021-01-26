import React, { useState, useEffect } from 'react';

import JumpButton from '/client/components/tinyUi/JumpButton.jsx';
import FilterActive from '/client/components/bigUi/FilterActive.jsx';

const BatchesList = ({ batchData, widgetData })=> {
  
  const [ filter, filterSet ] = useState( false );
  const [ textString, textStringSet ] = useState( '' );
  const [ variantNames, variantNamesSet ] = useState( [] );
  const [ showListState, showListSet ] = useState( batchData );

  function setFilter(rule) {
    filterSet(rule);
  }
  function setTextFilter(rule) {
    textStringSet(rule.toLowerCase());
  }
  
  useEffect( ()=> {
    let vFetch = [];
    for(let b of batchData) {
      Meteor.call('quickVariant', b.versionKey, (error, reply)=>{
        error && console.log(error);
        if(reply) {
          vFetch.push({vKey: b.versionKey, vName: reply});
        }else{null}
      });
    }
    variantNamesSet( vFetch );
  }, [ batchData ]);

  useEffect( ()=> {
    const b = batchData;
    const f = filter;
    
    let basicFilter = 
      f === 'done' ?
      b.filter( x => x.finishedAt !== false ) :
      f === 'inproc' ?
      b.filter( x => x.finishedAt === false ) :
      b;
    let showList = basicFilter.filter( 
                    tx => tx.batch.toLowerCase().includes(textString) === true );
    
    let sortList = showList.sort((b1, b2)=>
                      b1.batch < b2.batch ? 1 : b1.batch > b2.batch ? -1 : 0 );
    
    showListSet(sortList);
  }, [ batchData, filter, textString ]);
  
  return(
    <div key={1}>
    
      <FilterActive
        title={batchData.batch}
        done='Finished'
        total={showListState.length}
        onClick={e => setFilter(e)}
        onTxtChange={e => setTextFilter(e)} />
        
      {showListState.map( (entry, index)=> {
        const style = entry.live === true ? 
                      'leapBar dark numFont activeMark' : 
                      'leapBar dark numFont gMark';
        const subW = widgetData.find( x => x._id === entry.widgetId);
        const subV = variantNames.find( x => x.vKey === entry.versionKey);
        const subVname = !subV ? false : subV.vName;
        return(
          <JumpButton
            key={index}
            title={entry.batch} 
            sub={<i><i className='up'>{subW.widget}</i> v.{subVname}</i>}
            sty={style}
          />
      )})}
		</div>
  );
};

export default BatchesList;