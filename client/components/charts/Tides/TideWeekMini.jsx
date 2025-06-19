import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { TimeInWeek } from '/client/utility/WorkTimeCalc.js';
import { UserTime } from '/client/utility/WorkTimeCalc.js';
import { round1Decimal } from '/client/utility/Convert.js';
import Pref from '/client/global/pref.js';
import NumStatBox from '/client/components/charts/Dash/NumStatBox';

const TideWeekMini = ({ tideTimes, dateTime, app, user })=> {
  
  const [ batchTotal, batchSet ] = useState([]);
  const [ durrTotal, durrSet ] = useState(0);
  const [ maxHours, maxHoursSet ] = useState(0);
  
  useEffect( ()=> {
    const weekHours = TimeInWeek( app, dateTime );
    
    const proHours = UserTime( user, dateTime, 'week', weekHours );
      
    maxHoursSet(proHours);
  }, [dateTime]);
  
  
  useEffect( ()=> {
    const qBatches = tideTimes.reduce( (allBatch, batch, index, array)=> { 
      const objkey = !batch ? false : batch.batch;
      objkey &&
        objkey in allBatch ? allBatch[objkey]++ : allBatch[objkey] = 1;
      return allBatch;
    }, {});
    const qBatchesClean = _.omit(qBatches, (value, key, object)=> {
      return key == false;
    });
    const bITR = Object.entries(qBatchesClean);
    const bXY = Array.from(bITR, (arr)=> { return {x: arr[0], y: arr[1]} } );
    batchSet(bXY);
    
    const dTotal = tideTimes.reduce( (arr, x)=> { return arr + x.durrAsMin }, 0);
    const durrHr = moment.duration(dTotal, 'minutes').asHours();
    const dTotalNice = round1Decimal(durrHr);
    durrSet(dTotalNice);
    
  }, [tideTimes]);
  
  return(
    <div className='balance beside'>
      <NumStatBox
        number={batchTotal.length}
        name={batchTotal.length == 1 ? Pref.xBatch : Pref.xBatchs}
        title={`how many different ${Pref.xBatchs}`}
        borderColour="var(--peterriver)"
      />
      <NumStatBox
        number={`${durrTotal}/${maxHours}`}
        name='Total Hours'
        title={`total of durations in hours \nout of ${maxHours}`}
        borderColour="var(--neptuneColor)"
      />
    </div>
  );
};

export default TideWeekMini;