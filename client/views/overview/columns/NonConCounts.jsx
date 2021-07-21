import React, { Fragment, useState, useEffect } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';


const NonConCounts = ({ 
  batchID, releasedToFloor, force,
  app, ncCols, updateTrigger, isDebug
})=> {
  
  const [ ncData, setNC ] = useState(false);
  
  useEffect( ()=> {
    if(!releasedToFloor && !force) { null }else{
      Meteor.call('nonconQuickStats', batchID, 'warm', (error, reply)=>{
        error && console.log(error);
        if( reply ) { 
          setNC( reply );
          isDebug && console.log(ncData);
        }
      });
    }
  }, [batchID, updateTrigger]);
  
  const dt = ncData;
    
  if((releasedToFloor || force) && dt && dt.batchID === batchID) {
    return(
      <Fragment>
        <div>
          <NumStat
            num={dt.nonConTotal}
            name='NC Total'
            title='Total Noncons'
            color='redT'
            size='big' />
        </div>
        <div>
          <NumStat
            num={dt.nonConLeft}
            name='NC Remain'
            title='Unresolved Noncons'
            color='orangeT'
            size='big' />
        </div>
        <div>
          <NumStat
            num={dt.nonConRate}
            name='NC Rate'
            title='Rate of Noncons per Item'
            color='redT'
            size='big' />
        </div>
        <div>
          <NumStat
            num={dt.percentOfNCitems}
            name='NC Items'
            title='Percent of Items with Noncons'
            color='redT'
            size='big' />
        </div>
        <div>
          <NumStat
            num={dt.itemIsScrap}
            name='Scrap Boards'
            title=''
            color='redT'
            size='big' />
        </div>
        <div>
          <NumStat
            num={dt.itemHasRMA}
            name='RMA Boards'
            title=''
            color='redT'
            size='big' />
        </div>
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