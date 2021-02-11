import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-business-time';
import '/client/utility/ShipTime.js';
// import glTest from '/client/utility/GoodLocal.js';
// import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat.jsx';


const BatchTopStatus = ({ 
  rowIndex, batchID, tBatch,
  app, isDebug,
  statusCols, branchArea, dense
})=> {
  
  const [ dueDateShip, dueDateShipSet ] = useState(null);
  const [ weekDaysRemain, weekDaysRemainSet ] = useState(0);
  
  useEffect( ()=>{
    if(tBatch) {
      const shipAimMmnt = moment(tBatch.shipAim);
      
      const adaptDate = shipAimMmnt.isAfter(moment(), 'year') ?
                                  "MMM Do, YYYY" : "MMM Do";
      dueDateShipSet(shipAimMmnt.format(adaptDate));
      
      const timeRemain = !tBatch.completed ?
        shipAimMmnt.workingDiff(moment(), 'day', true) : 0;
      weekDaysRemainSet( timeRemain > -1 && timeRemain < 1 ? 
        timeRemain.toPrecision(1) : Math.round(timeRemain) );
    }
  }, [batchID, tBatch]);
  

  return(
    <Fragment>
      <div>
        <i><i className='label'>Due:<br /></i>{dueDateShip}</i>
      </div>
      <div>
        <NumStat
          num={ dense ? weekDaysRemain : Math.abs(weekDaysRemain) }
          name={
            weekDaysRemain < 0 ? 
              weekDaysRemain === -1 ?
                `Workday Overdue` :
                `Workdays Overdue` : 
                  weekDaysRemain === 1 ?
                    'Workday Remaining' :
                    'Workdays Remaining'}
          color={weekDaysRemain < 0 ? 'orangeT' : 'blackT'}
          size='big' />
      </div>
        
      <div>
        <NumStat
          num={tBatch.quantity || '?'}
          name='Total Items'
          // title=''
          color='blueT'
          size='big' />
      </div>
      
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
 /* 
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
*/
export default BatchTopStatus;