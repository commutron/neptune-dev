import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';

import NumStat from '/client/components/tinyUi/NumStat';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat';

const BatchTopStatus = ({ batchID, tBatch })=> {
  
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
  
  const dS = tBatch.docStatus || null;
  const dV = !dS ? null : dS.topLevelV;
  const dL = dS?.url || undefined;

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
      
      <div>
        <TrinaryStat
          status={tBatch.riverChosen}
          name={tBatch.riverChosen ? 'Serial Flow' :
                tBatch.riverChosen === false ? 'Counter Flow' :
                'No Flow'}
          title='Process Flow Assignment'
          size=''
          onIcon='fa-solid fa-diagram-project fa-2x greenT' 
          midIcon='fa-solid fa-stopwatch fa-2x greenT'
          offIcon='fa-solid fa-minus fa-2x grayT fade' />
      </div>
      
      <div className='overButton'>
        <a href={dL} target='_blank'>
        <TrinaryStat
          status={dV}
          name={dV ? 'Verified' :
                dV === false ? 'Unverified' :
                'Not Found'}
          title='Instruction Doc'
          onIcon='fa-solid fa-file-circle-check fa-2x greenT' 
          midIcon='fa-solid fa-file-shield fa-2x orangeT'
          offIcon='fa-solid fa-minus fa-2x grayT fade' 
        />
        </a>
      </div>
      
    </Fragment>
  );
};

export default BatchTopStatus;