import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
// import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';
import TrinaryStat from '/client/components/tinyUi/TrinaryStat.jsx';


const BatchTopStatus = ({ 
  rowIndex, batchID, app,
  isDebug, isNightly,
  statusCols, dense
})=> {
  
  const [ stData, setStatus ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('overviewBatchStatus', batchID, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setStatus( reply );
        isDebug && console.log(stData);
      }
    });
  }, [batchID]);
  
  const dt = stData;
  
  if( dt && dt.batchID === batchID ) {
    
    const dueDateShip = moment(dt.shipAim);
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
                  `Workday Overdue` :
                  `Workdays Overdue` : 
                    dt.weekDaysRemain === 1 ?
                      'Workday Remaining' :
                      'Workdays Remaining'}
            color={dt.weekDaysRemain < 0 ? 'orangeT' : 'grayT'}
            size='big' />
        </div>
        
        <div>
          <NumStat
            num={dt.itemQuantity}
            name='Total Items'
            title=''
            color='blueT'
            size='big' />
        </div>
        
        <div>
          <TrinaryStat
            status={dt.riverChosen}
            name='Flow'
            title='Process Flow Assignment'
            size=''
            onIcon='far fa-check-circle fa-2x greenT' 
            midIcon='far fa-times-circle fa-2x grayT' />
        </div>
        
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