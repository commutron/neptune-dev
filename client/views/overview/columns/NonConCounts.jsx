import React, { Fragment, useState, useEffect, useRef } from 'react';
import Pref from '/client/global/pref.js';

import NumStat from '/client/components/tinyUi/NumStat';


const NonConCounts = ({ 
  batchID, tBatch, releasedToFloor, force,
  app, ncCols, updateTrigger, isDebug
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ ncData, setNC ] = useState(false);
  
  useEffect( ()=> {
    if(!releasedToFloor && !force) { 
      null;
    }else if(tBatch && tBatch.btchNCs) {
      setNC( tBatch.btchNCs );
    }else{
      Meteor.call('nonconQuickStats', batchID, (error, reply)=>{
        error && console.log(error);
        if( reply && mounted.current ) { 
          setNC( reply );
          isDebug && console.log(ncData);
        }
      });
    }
  }, [batchID, updateTrigger]);
  
  if((releasedToFloor || force) && ncData && ncData.batchID === batchID) {
    return(
      <Fragment>
        <NumStat
          num={ncData.nonConTotal}
          name='NC Total'
          title='Total Noncons'
          color='redT'
          size='big'
        />
        <NumStat
          num={ncData.nonConLeft}
          name='NC Remain'
          title='Unresolved Noncons'
          color='orangeT'
          size='big'
        />
        <NumStat
          num={ncData.nonConRate}
          name='NC Rate'
          title='Rate of Noncons per Item'
          color='redT'
          size='big' 
        />
        <NumStat
          num={ncData.percentOfNCitems}
          name='NC Items'
          title='Percent of Items with Noncons'
          color='redT'
          size='big' 
        />
        <NumStat
          num={ncData.itemIsScrap}
          name={Pref.scrapped}
          title=''
          color='redT'
          size='big' 
        />
        <NumStat
          num={ncData.itemHasRMA}
          name={Pref.rapidExd}
          title=''
          color='redT'
          size='big' 
        />
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {ncCols.map( (nc, index)=>{
        return(
          <div key={batchID + nc + index + 'x'}>
            <i className='fade small label'>{nc}</i>
          </div>
      )})}
    </Fragment>
  );
};

export default NonConCounts;