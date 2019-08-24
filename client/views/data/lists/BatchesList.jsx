import React, { useState, useEffect } from 'react';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterActive from '/client/components/bigUi/FilterActive.jsx';

const BatchesList = (props)=> {
  
  const [ filter, filterSet ] = useState(false);
  const [ textString, textSet ] = useState('');
  const [ list, listSet ] = useState([]);
  
  const setFilter = (rule)=> {
    filterSet( rule );
  };
  const setTextFilter = (rule)=> {
    textSet( rule.toLowerCase() );
  };
    
  const b = props.batchData;
  const w = props.widgetData;
   
  useEffect( ()=> { 
    let basicFilter = 
      filter === 'done' ?
      b.filter( x => x.finishedAt ? x.finishedAt !== false : x.live === false ) :
      filter === 'inproc' ?
      b.filter( x => x.finishedAt ? x.finishedAt === false : x.live === true ) :
      b;
    let showList = basicFilter.filter( 
                    tx => tx.batch.toLowerCase().includes(textString) === true );
    let sortList = showList.sort((b1, b2)=> {
                if (b1.batch < b2.batch) { return 1 }
                if (b1.batch > b2.batch) { return -1 }
                return 0;
              });
    listSet(sortList);
  }, [ props, filter, textString ]);
            
  return (
    <div className='' key={1}>
      <div className='stickyBar'>
        <FilterActive
          title={b.batch}
          done='Finished'
          total={list.length}
          onClick={(e)=>setFilter(e)}
          onTxtChange={(e)=>setTextFilter(e)} />
      </div>  
      {list.map( (entry, index)=> {
        const style = entry.live === true ? 
                      'leapBar numFont activeMark' :
                      'leapBar numFont gMark';
        const subW = w.find( x => x._id === entry.widgetId);
        const subV = subW.versions.find( x => x.versionKey === entry.versionKey);
          return (
            <LeapButton
              key={index}
              title={entry.batch} 
              sub={<i><i className='up'>{subW.widget}</i> v.{subV.version}</i>}
              sty={style}
              address={'/data/batch?request=' + entry.batch}
            />
      )})}
		</div>
  );
};

export default BatchesList;