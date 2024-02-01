import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';

import NumStat from '/client/components/tinyUi/NumStat';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat';

const BatchTopStatus = ({ 
  rowIndex, batchID, tBatch,
  app, isDebug,
  statusCols, branchArea
})=> {
  
  const [ dueDateShip, dueDateShipSet ] = useState(null);
  const [ weekDaysRemain, weekDaysRemainSet ] = useState(0);
  
  useEffect( ()=>{
    if(tBatch) {
      const shipAimMmnt = moment(tBatch.shipAim);
      
      const adaptDate = shipAimMmnt.isAfter(moment(), 'year') ? "MMM Do, YYYY" : "MMM Do";
      dueDateShipSet(shipAimMmnt.format(adaptDate));
      
      const timeRemain = !tBatch.completed ?
        shipAimMmnt.workingDiff(moment(), 'day', true) : 0;
      weekDaysRemainSet( timeRemain > -1 && timeRemain < 1 ? 
        timeRemain.toPrecision(1) : Math.round(timeRemain) );
    }
  }, [batchID, tBatch]);
  

  return(
    <Fragment>
      <div className='med' title='Shipping Due Date'>
        <i><i className='label'>Due:<br /></i>{dueDateShip}</i>
      </div>

      <NumStat
        num={weekDaysRemain}
        name={
          weekDaysRemain < 0 ? 
            weekDaysRemain === -1 ?
              `Workday Overdue` :
              `Workdays Overdue` : 
                weekDaysRemain === 1 ?
                  'Workday Remaining' :
                  'Workdays Remaining'}
        title='Remaining Workdays'
        color={weekDaysRemain < 0 ? 'orangeT' : 'blackT'}
        size='big' />
      
      <NumStat
        num={tBatch.quantity || '?'}
        name='Total Items'
        title='Total Items Quantity'
        color='blueT'
        size='big' />
      
      {!branchArea &&
      <div>
        <TrinaryStat
          status={tBatch.riverChosen}
          name={tBatch.riverChosen ? 'Serial Flow' :
                tBatch.riverChosen === false ? 'Counter Flow' :
                'No Flow'}
          title='Process Flow Assignment'
          size=''
          onIcon='fas fa-check-circle fa-2x greenT' 
          midIcon='far fa-check-circle fa-2x greenT'
          offIcon='far fa-question-circle fa-2x blackT' />
      </div>}
      
    </Fragment>
  );
};

export default BatchTopStatus;