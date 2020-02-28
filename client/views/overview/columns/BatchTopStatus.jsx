import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
import PrioritySquareData from '/client/components/bigUi/PrioritySquare.jsx';
import { PrioritySquare } from '/client/components/bigUi/PrioritySquare.jsx';
// import TrinaryStat from '/client/components/uUi/TrinaryStat.jsx';


const BatchTopStatus = ({ 
  rowIndex, batchID,
  clientTZ, pCache, app, 
  statusCols, dense
})=> {
  
  const [ stData, setStatus ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('overviewBatchStatus', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setStatus( reply );
        Roles.userIsInRole(Meteor.userId(), 'debug') && console.log(stData);
      }
    });
  }, [batchID]);
  
  const dt = stData;
  const pt = pCache.dataSet.find( x => x.batchID === batchID );
   
  if( dt && dt.batchID === batchID ) {
    
    const dueDateShip = moment(dt.shipDue);
    const adaptDateShip = dueDateShip.isAfter(moment(), 'year') ?
                            "MMM Do, YYYY" : "MMM Do";
    
    return(
      <Fragment>
        <div>
          <i><i className='label'>Due:<br /></i>{dueDateShip.format(adaptDateShip)}</i>
        </div>
        <div>
          <NumStat
            num={ dense ? dt.weekDaysRemain : Math.abs(dt.weekDaysRemain) }
            name={
              dt.weekDaysRemain < 0 ? 
                dt.weekDaysRemain === -1 ?
                  'Workday Overdue' :
                  'Workdays Overdue' : 
                    dt.weekDaysRemain === 1 ?
                      'Workday Remaining' :
                      'Workdays Remaining'}
            title=''
            color={dt.weekDaysRemain < 0 ? 'yellowT' : 'blueT'}
            size='big' />
        </div>
        
        {!pt ?
          <PrioritySquareData
            batchID={batchID}
            altNumber={rowIndex+1}
            app={app} />
        :
          <PrioritySquare
            batchID={batchID}
            ptData={pt}
            altNumber={rowIndex+1}
            app={app} />
        }
        
        <div>
          <NumStat
            num={dt.itemQuantity}
            name='Total Boards'
            title=''
            color='blueT'
            size='big' />
        </div>
        
        {/*
        <div>
          <TrinaryStat
            status={dt.isActive ? true : null}
            name='Active'
            title={`Has had ${Pref.tide} activity today`}
            size=''
            onIcon='fas fa-shoe-prints fa-2x' 
            offIcon='far fa-pause-circle fa-2x' />
        </div>
        */}
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {statusCols.map( (st, index)=>{
        return(
          <div key={batchID + st + index + 'x'}>
            <i className='fade small label'>{st}</i>
          </div>
      )})}
    </Fragment>
  );
};

export default BatchTopStatus;